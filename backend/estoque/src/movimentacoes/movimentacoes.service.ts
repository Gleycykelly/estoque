import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovimentacoeDto } from './dto/create-movimentacoe.dto';
import { UpdateMovimentacoeDto } from './dto/update-movimentacoe.dto';
import { Movimentacoes } from './entities/movimentacao.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { LancamentosProdutosService } from 'src/lancamentos-produtos/lancamentos-produtos.service';
import { AuthService } from 'src/auth/auth.service';
import { ObterParcialMovimentacaoDto } from './dto/obter-parcial-movimentacao.dto';

@Injectable()
export class MovimentacoesService {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuariosService,
    private readonly lancamentoProdutoService: LancamentosProdutosService,
  ) {}

  @InjectRepository(Movimentacoes)
  private readonly movimentacaoRepository: Repository<Movimentacoes>;

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

    const movimentacao = this.movimentacaoRepository.create({
      ...createMovimentacoeDto,
    });
    return this.movimentacaoRepository.save(movimentacao);
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

    const movimentacao = await this.movimentacaoRepository.preload({
      ...updateMovimentacoeDto,
      id,
    });

    if (!movimentacao) {
      throw new NotFoundException(
        `Nenhuma movimentação encontrada para o id ${id}`,
      );
    }

    return this.movimentacaoRepository.save(movimentacao);
  }

  async findAll() {
    return await this.movimentacaoRepository.find({
      relations: [
        'lancamentoProduto',
        'lancamentoProduto.produto',
        'lancamentoProduto.produto.porcoes',
        'lancamentoProduto.produto.porcoes.unidadeMedida',
        'lancamentoProduto.produto.porcoes.valorNutricional',
        'lancamentoProduto.produto.porcoes.informacaoNutricional',
        'lancamentoProduto.fornecedor',
        'lancamentoProduto.fornecedor.endereco',
        'lancamentoProduto.localizacaoDeposito',
        'lancamentoProduto.localizacaoDeposito.deposito',
        'usuario',
      ],
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.movimentacaoRepository.findOne({
      where: { id },
      relations: [
        'lancamentoProduto',
        'lancamentoProduto.produto',
        'lancamentoProduto.produto.porcoes',
        'lancamentoProduto.produto.porcoes.unidadeMedida',
        'lancamentoProduto.produto.porcoes.valorNutricional',
        'lancamentoProduto.produto.porcoes.informacaoNutricional',
        'lancamentoProduto.fornecedor',
        'lancamentoProduto.fornecedor.endereco',
        'lancamentoProduto.localizacaoDeposito',
        'lancamentoProduto.localizacaoDeposito.deposito',
        'lancamentoProduto.localizacaoDeposito.deposito.endereco',
        'lancamentoProduto.localizacaoDeposito.deposito.endereco.municipio',
        'lancamentoProduto.localizacaoDeposito.deposito.endereco.municipio.uf',
        'usuario',
      ],
    });
  }

  async obterParcial(
    obterParcialMovimentacaoDto: ObterParcialMovimentacaoDto,
  ): Promise<Movimentacoes[]> {
    if (!obterParcialMovimentacaoDto) {
      return this.findAll();
    }

    let query = await this.movimentacaoRepository
      .createQueryBuilder('movimentacao')
      .leftJoinAndSelect('movimentacao.lancamentoProduto', 'lancamento')
      .leftJoinAndSelect('lancamento.produto', 'produto')
      .leftJoinAndSelect('movimentacao.usuario', 'usuario')
      .leftJoinAndSelect('lancamento.localizacaoDeposito', 'localiza')
      .leftJoinAndSelect('localiza.deposito', 'deposito')
      .leftJoinAndSelect('lancamento.fornecedor', 'fornecedor');

    if (obterParcialMovimentacaoDto.termoDePesquisa) {
      query = query
        .leftJoinAndSelect(
          'movimentacao.lancamentoProduto',
          'lancamentoProduto',
        )
        .leftJoinAndSelect('lancamentoProduto.produto', 'produto')
        .where('LOWER(produto.nome) LIKE LOWER(:termo)', {
          termo: `%${obterParcialMovimentacaoDto.termoDePesquisa}%`,
        });
    }
    if (
      obterParcialMovimentacaoDto.depositos &&
      obterParcialMovimentacaoDto.depositos.length > 0
    ) {
      query = query.andWhere('deposito.id IN (:...depositos)', {
        depositos: obterParcialMovimentacaoDto.depositos,
      });
    }

    if (
      obterParcialMovimentacaoDto.produtos &&
      obterParcialMovimentacaoDto.produtos.length > 0
    ) {
      query = query.andWhere('produto.id IN (:...produtos)', {
        produtos: obterParcialMovimentacaoDto.produtos,
      });
    }

    if (
      obterParcialMovimentacaoDto.fornecedores &&
      obterParcialMovimentacaoDto.fornecedores.length > 0
    ) {
      query = query.andWhere('fornecedor.id IN (:...fornecedores)', {
        fornecedores: obterParcialMovimentacaoDto.fornecedores,
      });
    }

    if (
      obterParcialMovimentacaoDto.operadores &&
      obterParcialMovimentacaoDto.operadores.length > 0
    ) {
      query = query.andWhere('usuario.id IN (:...operadores)', {
        operadores: obterParcialMovimentacaoDto.operadores,
      });
    }

    if (obterParcialMovimentacaoDto.quantidadeMaiorQue) {
      query = query.andWhere('movimentacao.quantidade > (:maiorQue)', {
        maiorQue: obterParcialMovimentacaoDto.quantidadeMaiorQue,
      });
    }

    if (obterParcialMovimentacaoDto.quantidadeMenorQue) {
      query = query.andWhere('movimentacao.quantidade < (:menorQue)', {
        menorQue: obterParcialMovimentacaoDto.quantidadeMenorQue,
      });
    }

    if (obterParcialMovimentacaoDto.diasParaVencer) {
      const dataVencimento = new Date();
      dataVencimento.setDate(
        dataVencimento.getDate() +
          Number(obterParcialMovimentacaoDto.diasParaVencer),
      );

      query = query.andWhere('lancamento.dataValidade = (:dataVencimento)', {
        dataVencimento: dataVencimento.toISOString(),
      });
    }

    if (obterParcialMovimentacaoDto.produtosVencidos) {
      const dataAtual = new Date();

      query = query.andWhere(' lancamento.dataValidade < (:dataAtual)', {
        dataAtual: dataAtual.toISOString(),
      });
    }

    if (obterParcialMovimentacaoDto.tipoMovimentacao) {
      query = query.andWhere(
        ' movimentacao.tipoMovimentacao = :tipoMovimentacao',
        {
          tipoMovimentacao: obterParcialMovimentacaoDto.tipoMovimentacao,
        },
      );
    }

    query.orderBy('movimentacao.id', 'ASC');
    const result = await query.getMany();
    return result;
  }

  async remove(id: number) {
    const movimentacao = await this.movimentacaoRepository.findOne({
      where: { id },
    });

    if (!movimentacao) {
      throw new NotFoundException(
        `Nenhuma movimentação encontrada para o id ${id}`,
      );
    }

    return this.movimentacaoRepository.remove(movimentacao);
  }

  async obterPorLote(lote: string) {
    const movimentacoes = await this.movimentacaoRepository.find({
      where: { lancamentoProduto: { lote: lote } },
      relations: [
        'lancamentoProduto',
        'lancamentoProduto.produto',
        'lancamentoProduto.produto.porcoes',
        'lancamentoProduto.produto.porcoes.unidadeMedida',
        'lancamentoProduto.produto.porcoes.valorNutricional',
        'lancamentoProduto.produto.porcoes.informacaoNutricional',
        'lancamentoProduto.fornecedor',
        'lancamentoProduto.fornecedor.endereco',
        'lancamentoProduto.localizacaoDeposito',
        'lancamentoProduto.localizacaoDeposito.deposito',
        'usuario',
      ],
    });

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

  private async obtemEntidadeEstrangeira(entidade: any, service: any) {
    if (entidade.id) {
      const entidadeBD = await service.findOne(entidade.id);
      return await service.update(entidadeBD.id, entidade);
    }
    return service.create({ ...entidade });
  }

  async valorTotalEntradasSaidas() {
    const query = `
       SELECT
          SUM(CASE WHEN m."tipo_movimentacao"  = 'Entrada' THEN lp."preco_custo" * m."quantidade" ELSE 0 END) AS total_entrada,
          SUM(CASE WHEN m."tipo_movimentacao" = 'Saída' THEN lp."preco_venda" * m."quantidade" ELSE 0 END) AS total_saida
      from movimentacoes m
       inner join lancamentos_produtos lp on lp."id" = m."id_lancamento_produto";
    `;

    const results = await this.movimentacaoRepository.query(query);

    const { total_entrada, total_saida } = results[0];
    return { totalEntrada: total_entrada || 0, totalSaida: total_saida || 0 };
  }

  async ultimasMovimentacoes() {
    const query = `
      select  p."nome", m."quantidade", m."tipo_movimentacao"  from movimentacoes m 
inner join lancamentos_produtos lp on lp."id" = m."id_lancamento_produto"
inner join produtos p on p."id" = lp."id_produto" limit 5;
    `;

    const results = await this.movimentacaoRepository.query(query);

    return results;
  }
}
