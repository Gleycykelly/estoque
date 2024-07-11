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

    console.log('nova saída');
    console.log(createMovimentacoeDto);

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
        'usuario',
      ],
    });
  }

  async obterParcial(
    obterParcialMovimentacaoDto: ObterParcialMovimentacaoDto,
  ): Promise<Movimentacoes[]> {
    if (!obterParcialMovimentacaoDto.termoDePesquisa) {
      return this.findAll();
    }
    return await this.movimentacaoRepository
      .createQueryBuilder('movimentacao')
      .leftJoinAndSelect('movimentacao.lancamentoProduto', 'lancamentoProduto')
      .leftJoinAndSelect('lancamentoProduto.produto', 'produto')
      .where('LOWER(produto.nome) LIKE LOWER(:termo)', {
        termo: `%${obterParcialMovimentacaoDto.termoDePesquisa}%`,
      })
      .getMany();
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

    console.log(entradas);

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

  // async buscarMovimentacoesPorLote(lote: string): Promise<Movimentacoes[]> {
  //   return this.movimentacaoRepository.find({
  //     where: { lancamentoProduto: { lote } },
  //     relations: [
  //       'lancamentoProduto',
  //       'lancamentoProduto.produto',
  //       'lancamentoProduto.produto.porcoes',
  //       'lancamentoProduto.produto.porcoes.unidadeMedida',
  //       'lancamentoProduto.produto.porcoes.valorNutricional',
  //       'lancamentoProduto.produto.porcoes.informacaoNutricional',
  //       'lancamentoProduto.fornecedor',
  //       'lancamentoProduto.fornecedor.endereco',
  //       'lancamentoProduto.localizacaoDeposito',
  //       'lancamentoProduto.localizacaoDeposito.deposito',
  //       'usuario',
  //     ],
  //   });
  // }
}
