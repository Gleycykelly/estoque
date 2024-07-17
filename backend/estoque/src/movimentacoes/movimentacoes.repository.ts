import { DataSource, Repository } from 'typeorm';
import { Movimentacoes } from './entities/movimentacao.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovimentacoeDto } from './dto/create-movimentacoe.dto';
import { UpdateMovimentacoeDto } from './dto/update-movimentacoe.dto';
import { ObterParcialMovimentacaoDto } from './dto/obter-parcial-movimentacao.dto';

@Injectable()
export class MovimentacoesRepository extends Repository<Movimentacoes> {
  constructor(private dataSource: DataSource) {
    super(Movimentacoes, dataSource.createEntityManager());
  }

  async createMovimentacao(
    createMovimentacoeDto: CreateMovimentacoeDto,
  ): Promise<Movimentacoes> {
    const movimentacao = await this.create({
      ...createMovimentacoeDto,
    });
    return await this.save(movimentacao);
  }

  async updateMovimentacao(
    id: number,
    updateMovimentacoeDto: UpdateMovimentacoeDto,
  ): Promise<Movimentacoes> {
    const movimentacao = await this.preload({
      ...updateMovimentacoeDto,
      id,
    });

    if (!movimentacao) {
      throw new NotFoundException(
        `Nenhuma movimentação encontrada para o id ${id}`,
      );
    }

    return await this.save(movimentacao);
  }

  async obterTodos(): Promise<Movimentacoes[]> {
    return await this.find({
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

  async obterPorId(id: number) {
    return await this.findOne({
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
    let query = await this.createQueryBuilder('movimentacao')
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

  async excluir(id: number) {
    const movimentacao = await this.obterPorId(id);

    return await this.remove(movimentacao);
  }
}
