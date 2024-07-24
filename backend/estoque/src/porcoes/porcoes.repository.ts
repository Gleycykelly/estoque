import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Porcoes } from './entities/porcao.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePorcoeDto } from './dto/create-porcoe.dto';
import { UpdatePorcoeDto } from './dto/update-porcoe.dto';

@Injectable()
export class PorcoesRepository extends Repository<Porcoes> {
  constructor(private dataSource: DataSource) {
    super(Porcoes, dataSource.createEntityManager());
  }

  async createPorcao(createPorcoeDto: CreatePorcoeDto): Promise<Porcoes> {
    const porcao = this.create({
      ...createPorcoeDto,
    });

    return await this.save(porcao);
  }

  async updatePorcao(
    id: number,
    updatePorcoeDto: UpdatePorcoeDto,
  ): Promise<Porcoes> {
    const porcao = await this.preload({
      ...updatePorcoeDto,
      id,
    });

    if (!porcao) {
      throw new NotFoundException(`Nenhuma porção encontrada para o id ${id}`);
    }

    return await this.save(porcao);
  }

  async obterTodos(): Promise<Porcoes[]> {
    return await this.find({
      relations: [
        'produto',
        'unidadeMedida',
        'valorNutricional',
        'informacaoNutricional',
      ],
      order: {
        id: 'ASC',
      },
    });
  }

  async obterPorId(id: number): Promise<Porcoes> {
    return await this.findOne({
      where: { id },
      relations: [
        'produto',
        'unidadeMedida',
        'valorNutricional',
        'informacaoNutricional',
      ],
    });
  }

  async existePorcao(porcao: string, idProduto: number) {
    return await this.count({
      where: { porcao: porcao, produto: { id: idProduto } },
    });
  }

  async porcaoPorProduto(porcao: string, produtoId: number): Promise<Porcoes> {
    return await this.findOne({
      where: {
        porcao: porcao,
        produto: { id: produtoId },
      },
    });
  }

  async excluir(id: number, queryRunner?: QueryRunner) {
    let porcao: Porcoes;

    if (queryRunner) {
      porcao = await queryRunner.manager.findOne(Porcoes, {
        where: { id },
      });
    } else {
      porcao = await this.obterPorId(id);
    }

    if (!porcao) {
      throw new NotFoundException(`Nenhuma porção encontrada para o id ${id}`);
    }

    if (queryRunner) {
      return await queryRunner.manager.remove(Porcoes, porcao);
    } else {
      return await this.remove(porcao);
    }
  }
}
