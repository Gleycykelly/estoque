import { DataSource, Repository, QueryRunner } from 'typeorm';
import { LancamentosProdutos } from './entities/lancamento-produto.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLancamentosProdutoDto } from './dto/create-lancamentos-produto.dto';
import { UpdateLancamentosProdutoDto } from './dto/update-lancamentos-produto.dto';

@Injectable()
export class LancamentosProdutosRepository extends Repository<LancamentosProdutos> {
  constructor(private dataSource: DataSource) {
    super(LancamentosProdutos, dataSource.createEntityManager());
  }

  async createLancamentosProduto(
    createLancamentosProdutoDto: CreateLancamentosProdutoDto,
  ): Promise<LancamentosProdutos> {
    const lancamento = await this.create({
      ...createLancamentosProdutoDto,
    });
    return await this.save(lancamento);
  }

  async updateLancamentosProduto(
    id: number,
    updateLancamentosProdutoDto: UpdateLancamentosProdutoDto,
  ) {
    const lancamentoProduto = await this.preload({
      ...updateLancamentosProdutoDto,
      id,
    });

    if (!lancamentoProduto) {
      throw new NotFoundException(
        `Nenhum lançamento encontrado para o id ${id}`,
      );
    }

    return await this.save(lancamentoProduto);
  }

  async obterTodos(): Promise<LancamentosProdutos[]> {
    return await this.find({
      relations: [
        'produto',
        'fornecedor',
        'localizacaoDeposito',
        'localizacaoDeposito.deposito',
        'usuario',
      ],
    });
  }

  async obterPorId(id: number): Promise<LancamentosProdutos> {
    return await this.findOne({
      where: { id },
      relations: [
        'produto',
        'fornecedor',
        'localizacaoDeposito',
        'localizacaoDeposito.deposito',
      ],
    });
  }

  async obterPeloLote(lote: string): Promise<LancamentosProdutos> {
    return await this.findOne({
      where: {
        lote,
      },
    });
  }

  async existeLancamentoParaOLote(lote: string) {
    return await this.count({
      where: { lote: lote },
    });
  }

  async excluir(id: number, queryRunner?: QueryRunner) {
    let lancamentoProduto: LancamentosProdutos;

    if (queryRunner) {
      lancamentoProduto = await queryRunner.manager.findOne(
        LancamentosProdutos,
        {
          where: { id },
        },
      );
    } else {
      lancamentoProduto = await this.obterPorId(id);
    }

    if (!lancamentoProduto) {
      throw new NotFoundException(
        `Nenhum lançamento de produto encontrado para o id ${id}`,
      );
    }

    if (queryRunner) {
      return await queryRunner.manager.remove(
        LancamentosProdutos,
        lancamentoProduto,
      );
    } else {
      return await this.remove(lancamentoProduto);
    }
  }
}
