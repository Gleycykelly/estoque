import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovimentacoeDto } from './dto/create-movimentacoe.dto';
import { UpdateMovimentacoeDto } from './dto/update-movimentacoe.dto';
import { Movimentacoes } from './entities/movimentacao.entity';
import { DataSource } from 'typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { LancamentosProdutosService } from 'src/lancamentos-produtos/lancamentos-produtos.service';
import { AuthService } from 'src/auth/auth.service';
import { ObterParcialMovimentacaoDto } from './dto/obter-parcial-movimentacao.dto';
import { LancamentosProdutos } from 'src/lancamentos-produtos/entities/lancamento-produto.entity';
import { format } from 'date-fns';
import { DadosEmissaoExcelDto } from 'src/emissoes/excel/dto/dados-emissao-excel.dto';
import { MovimentacoesRepository } from './movimentacoes.repository';

@Injectable()
export class MovimentacoesService {
  constructor(
    private readonly repositorio: MovimentacoesRepository,
    private dataSource: DataSource,
    private readonly authService: AuthService,
    private readonly usuarioService: UsuariosService,
    private readonly lancamentoProdutoService: LancamentosProdutosService,
  ) {}

  async create(createMovimentacoeDto: CreateMovimentacoeDto, token: string) {
    createMovimentacoeDto.dataMovimentacao = new Date();

    const decodedToken = await this.authService.checkToken(token);

    createMovimentacoeDto.usuario = await this.usuarioService.findOne(
      decodedToken.id,
    );

    createMovimentacoeDto.lancamentoProduto =
      await this.obtemEntidadeEstrangeira(
        createMovimentacoeDto.lancamentoProduto,
        this.lancamentoProdutoService,
      );

    return await this.repositorio.createMovimentacao(createMovimentacoeDto);
  }

  async update(id: number, updateMovimentacoeDto: UpdateMovimentacoeDto) {
    updateMovimentacoeDto.dataMovimentacao = new Date();

    updateMovimentacoeDto.lancamentoProduto =
      await this.obtemEntidadeEstrangeira(
        updateMovimentacoeDto.lancamentoProduto,
        this.lancamentoProdutoService,
      );

    updateMovimentacoeDto.usuario = await this.usuarioService.findOne(
      updateMovimentacoeDto.usuario.id,
    );
    return await this.repositorio.updateMovimentacao(id, updateMovimentacoeDto);
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async obterParcial(
    obterParcialMovimentacaoDto: ObterParcialMovimentacaoDto,
    token: string,
  ): Promise<Movimentacoes[]> {
    const dadosUsuarioLogado =
      await this.usuarioService.obterUsuarioLogado(token);

    const depositos = [];

    if (dadosUsuarioLogado.permissaoUsuario != 'Administrador') {
      for (const deposito of dadosUsuarioLogado.depositos) {
        depositos.push(deposito.id);
      }
    }

    if (
      dadosUsuarioLogado.permissaoUsuario === 'Usuario' &&
      depositos.length < 1
    ) {
      return null;
    }

    if (
      obterParcialMovimentacaoDto.depositos == null ||
      obterParcialMovimentacaoDto.depositos.length < 1
    ) {
      obterParcialMovimentacaoDto.depositos = depositos;
    }

    return await this.repositorio.obterParcial(obterParcialMovimentacaoDto);
  }

  async remove(id: number) {
    const queryRunner = this.repositorio.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const movimentacao = await this.repositorio.obterPorId(id);

      if (!movimentacao) {
        throw new NotFoundException(
          `Nenhuma movimentação encontrada para o id ${id}`,
        );
      }

      if (movimentacao.tipoMovimentacao == 'Saída') {
        await this.repositorio.excluir(movimentacao.id);
      }

      if (movimentacao.tipoMovimentacao == 'Entrada') {
        queryRunner.manager.getRepository(Movimentacoes);
        queryRunner.manager.getRepository(LancamentosProdutos);

        const lancamentoParaRemover = movimentacao.lancamentoProduto.id;

        const movimetacoesSaida = await this.repositorio.find({
          where: { lancamentoProduto: { id: lancamentoParaRemover } },
        });

        await queryRunner.manager.remove(Movimentacoes, movimentacao);

        for (const movimentacao of movimetacoesSaida) {
          await queryRunner.manager.remove(Movimentacoes, movimentacao);
        }

        await this.lancamentoProdutoService.remove(
          lancamentoParaRemover,
          queryRunner,
        );

        await queryRunner.commitTransaction();
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Não foi possível excluir a movimentação.');
    } finally {
      await queryRunner.release();
    }
  }

  async obterPorLote(lote: string) {
    const movimentacoes = await this.repositorio.obterPorLote(lote);

    if (!movimentacoes || movimentacoes.length <= 0) {
      throw new NotFoundException(
        `Nenhuma entrada encontrada para o lote ${lote}`,
      );
    }

    const entradas = movimentacoes
      .filter((m: any) => m.tipoMovimentacao === 'Entrada')
      .sort((a, b) => (a.dataMovimentacao < b.dataMovimentacao ? -1 : 1));

    const saidas = movimentacoes.filter(
      (m: any) => m.tipoMovimentacao === 'Saída',
    );

    const ultimaEntrada = entradas[entradas.length - 1];
    delete ultimaEntrada.id;
    delete ultimaEntrada.usuario;

    return {
      totalEntrada: entradas.reduce(
        (total: number, m: any) => total + m.quantidade,
        0,
      ),
      totalSaida: saidas.reduce(
        (total: number, m: any) => total + m.quantidade,
        0,
      ),
      movimentacao: ultimaEntrada,
    };
  }

  async obterMovimentacaoProdutosParaEmissao(
    dadosEmissaoExcelDto: DadosEmissaoExcelDto,
    token: string,
  ) {
    const dadosUsuarioLogado =
      await this.usuarioService.obterUsuarioLogado(token);

    const depositos = [];

    if (dadosUsuarioLogado.permissaoUsuario != 'Administrador') {
      for (const deposito of dadosUsuarioLogado.depositos) {
        depositos.push(deposito.id);
      }
    }

    if (
      dadosUsuarioLogado.permissaoUsuario === 'Usuario' &&
      depositos.length < 1
    ) {
      throw new NotFoundException('Nenhum item encontrado para emissão!');
    }

    if (
      dadosEmissaoExcelDto.depositos == null ||
      dadosEmissaoExcelDto.depositos.length < 1
    ) {
      dadosEmissaoExcelDto.depositos = depositos;
    }

    const movimentacoes =
      await this.repositorio.obterMovimentacaoProdutosParaEmissao(
        dadosEmissaoExcelDto,
      );

    if (movimentacoes == null || movimentacoes.length <= 0) {
      throw new NotFoundException('Nenhum item encontrado para emissão!');
    }

    let dados = [];

    for (const movimentacao of movimentacoes) {
      if (dados.length <= 0) {
        dados.push({
          deposito:
            movimentacao.lancamentoProduto.localizacaoDeposito.deposito
              .descricao,
          codigoProduto: movimentacao.lancamentoProduto.produto.codigoProduto,
          produto: movimentacao.lancamentoProduto.produto.nome,
          dataValidade: format(
            movimentacao.lancamentoProduto.dataValidade,
            'dd/MM/yyyy',
          ),
          quantidadeEmEstoque:
            movimentacao.tipoMovimentacao === 'Entrada'
              ? movimentacao.quantidade
              : -movimentacao.quantidade,
          lote: movimentacao.lancamentoProduto.lote,
          localizacao: `Corredor: ${movimentacao.lancamentoProduto.localizacaoDeposito.corredor} - Prateleira: ${movimentacao.lancamentoProduto.localizacaoDeposito.prateleira}`,
        });
      } else {
        const index = dados.findIndex(
          (m) => m.lote === movimentacao.lancamentoProduto.lote,
        );
        if (index != -1) {
          dados[index].quantidadeEmEstoque =
            dados[index].quantidadeEmEstoque +
            (movimentacao.tipoMovimentacao == 'Entrada'
              ? movimentacao.quantidade
              : -movimentacao.quantidade);
        } else {
          dados.push({
            deposito:
              movimentacao.lancamentoProduto.localizacaoDeposito.deposito
                .descricao,
            codigoProduto: movimentacao.lancamentoProduto.produto.codigoProduto,
            dataValidade: format(
              movimentacao.lancamentoProduto.dataValidade,
              'dd/MM/yyyy',
            ),
            produto: movimentacao.lancamentoProduto.produto.nome,
            quantidadeEmEstoque:
              movimentacao.tipoMovimentacao === 'Entrada'
                ? movimentacao.quantidade
                : -movimentacao.quantidade,
            lote: movimentacao.lancamentoProduto.lote,
            localizacao: `Corredor: ${movimentacao.lancamentoProduto.localizacaoDeposito.corredor} - Prateleira: ${movimentacao.lancamentoProduto.localizacaoDeposito.prateleira}`,
          });
        }
      }
    }

    if (dadosEmissaoExcelDto.quantidadeMenorQue) {
      dados = dados.filter((m) => {
        const quantidadeEmEstoque = Number(m.quantidadeEmEstoque);
        return quantidadeEmEstoque < dadosEmissaoExcelDto.quantidadeMenorQue;
      });
    }

    if (dadosEmissaoExcelDto.quantidadeMaiorQue) {
      dados = dados.filter((m) => {
        const quantidadeEmEstoque = Number(m.quantidadeEmEstoque);
        return quantidadeEmEstoque > dadosEmissaoExcelDto.quantidadeMaiorQue;
      });
    }

    if (
      dadosEmissaoExcelDto.diasParaVencer ||
      dadosEmissaoExcelDto.produtosVencidos
    ) {
      dados = dados.filter((m) => m.quantidadeEmEstoque > 0);
    }
    if (dados == null || dados.length <= 0) {
      throw new NotFoundException('Nenhum item encontrado para emissão!');
    }
    return dados;
  }

  async obterMovimentacoesParaEmissao(
    dadosEmissaoExcelDto: DadosEmissaoExcelDto,
    token: string,
  ) {
    const dadosUsuarioLogado =
      await this.usuarioService.obterUsuarioLogado(token);

    const depositos = [];

    if (dadosUsuarioLogado.permissaoUsuario != 'Administrador') {
      for (const deposito of dadosUsuarioLogado.depositos) {
        depositos.push(deposito.id);
      }
    }

    if (
      dadosUsuarioLogado.permissaoUsuario === 'Usuario' &&
      depositos.length < 1
    ) {
      throw new NotFoundException('Nenhum item encontrado para emissão!');
    }

    if (
      dadosEmissaoExcelDto.depositos == null ||
      dadosEmissaoExcelDto.depositos.length < 1
    ) {
      dadosEmissaoExcelDto.depositos = depositos;
    }

    const movimentacoes =
      await this.repositorio.obterMovimentacoesParaEmissao(
        dadosEmissaoExcelDto,
      );

    if (movimentacoes == null || movimentacoes.length <= 0) {
      throw new NotFoundException('Nenhum item encontrado para emissão!');
    }

    const dados = [];

    for (const movimentacao of movimentacoes) {
      dados.push({
        tipoMovimentacao: movimentacao.tipoMovimentacao,
        dataMovimentacao: movimentacao.dataMovimentacao,
        lote: movimentacao.lancamentoProduto.lote,
        produto: movimentacao.lancamentoProduto.produto.nome,
        validade: movimentacao.lancamentoProduto.dataValidade,
        precoCusto: movimentacao.lancamentoProduto.precoCusto,
        precoVenda: movimentacao.lancamentoProduto.precoVenda,
        quantidade: movimentacao.quantidade,
        fornecedor: movimentacao.lancamentoProduto.fornecedor.razaoSocial,
        deposito:
          movimentacao.lancamentoProduto.localizacaoDeposito.deposito.descricao,
        operador: movimentacao.usuario.nome,
      });
    }

    return dados;
  }

  private async obtemEntidadeEstrangeira(entidade: any, service: any) {
    if (entidade.id) {
      const entidadeBD = await service.findOne(entidade.id);
      return await service.update(entidadeBD.id, entidade);
    }
    return await service.create({ ...entidade });
  }

  async valorTotalEntradasSaidas(token: string) {
    const dadosUsuarioLogado =
      await this.usuarioService.obterUsuarioLogado(token);

    const depositos = [];

    if (dadosUsuarioLogado.permissaoUsuario != 'Administrador') {
      for (const deposito of dadosUsuarioLogado.depositos) {
        depositos.push(deposito.id);
      }
    }

    if (
      dadosUsuarioLogado.permissaoUsuario === 'Usuario' &&
      depositos.length < 1
    ) {
      return {
        totalEntrada: 0,
        totalSaida: 0,
        totalProdutos: 0,
      };
    }

    const results = await this.repositorio.valorTotalEntradasSaidas(depositos);
    const { total_entrada, total_saida, total_produtos } = results[0];
    return {
      totalEntrada: total_entrada || 0,
      totalSaida: total_saida || 0,
      totalProdutos: total_produtos || 0,
    };
  }

  async produtosProximosDoVencimento(token: string) {
    const dadosUsuarioLogado =
      await this.usuarioService.obterUsuarioLogado(token);

    const depositos = [];

    if (dadosUsuarioLogado.permissaoUsuario != 'Administrador') {
      for (const deposito of dadosUsuarioLogado.depositos) {
        depositos.push(deposito.id);
      }
    }

    if (
      dadosUsuarioLogado.permissaoUsuario === 'Usuario' &&
      depositos.length < 1
    ) {
      return null;
    }

    let dados = await this.repositorio.produtosProximosDoVencimento(depositos);

    if (dados && dados.length > 0) {
      dados = dados.filter((m) => m.total_produtos > 0);
    }
    return dados;
  }

  async quantidadeProdutosPorEstoque(token: string) {
    const dadosUsuarioLogado =
      await this.usuarioService.obterUsuarioLogado(token);

    const depositos = [];

    if (dadosUsuarioLogado.permissaoUsuario != 'Administrador') {
      for (const deposito of dadosUsuarioLogado.depositos) {
        depositos.push(deposito.id);
      }
    }

    if (
      dadosUsuarioLogado.permissaoUsuario === 'Usuario' &&
      depositos.length < 1
    ) {
      return null;
    }

    const dados =
      await this.repositorio.quantidadeProdutosPorEstoque(depositos);
    return dados;
  }

  async ultimasMovimentacoes() {
    return await this.repositorio.ultimasMovimentacoes();
  }
}
