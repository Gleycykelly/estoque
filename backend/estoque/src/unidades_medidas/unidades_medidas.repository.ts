import { DataSource, Repository } from 'typeorm';
import { UnidadesMedidas } from './entities/unidades_medida.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnidadesMedidaDto } from './dto/create-unidades_medida.dto';
import { UpdateUnidadesMedidaDto } from './dto/update-unidades_medida.dto';
import { ObterParcialUnidadeMedidaDto } from './dto/obter-parcial-unidade-medida.dto';

@Injectable()
export class UnidadesMedidasRepository extends Repository<UnidadesMedidas> {
  constructor(private dataSource: DataSource) {
    super(UnidadesMedidas, dataSource.createEntityManager());
  }

  async createUnidadeMedida(
    createUnidadesMedidaDto: CreateUnidadesMedidaDto,
  ): Promise<UnidadesMedidas> {
    const unidadeMedida = await this.create({
      ...createUnidadesMedidaDto,
    });

    return await this.save(unidadeMedida);
  }

  async updateUnidadeMedida(
    id: number,
    updateUnidadesMedidaDto: UpdateUnidadesMedidaDto,
  ): Promise<UnidadesMedidas> {
    const unidadeMedida = await this.preload({
      ...updateUnidadesMedidaDto,
      id,
    });

    if (!unidadeMedida) {
      throw new NotFoundException(
        `Nenhuma unidade de medida encontrada para o id ${id}`,
      );
    }

    return await this.save(unidadeMedida);
  }

  async obterTodos(): Promise<UnidadesMedidas[]> {
    return await this.find({
      order: {
        id: 'ASC',
        porcoes: { id: 'ASC' },
      },
    });
  }

  async obterPorId(id: number): Promise<UnidadesMedidas> {
    return await this.findOne({
      where: { id },
    });
  }

  async obterParcial(
    obterParcialUnidadeMedidaDto: ObterParcialUnidadeMedidaDto,
  ): Promise<UnidadesMedidas[]> {
    let query = this.createQueryBuilder('unidadeMedida');

    if (obterParcialUnidadeMedidaDto.termoDePesquisa) {
      query = query
        .where('LOWER(unidadeMedida.sigla) LIKE LOWER(:termo)', {
          termo: `%${obterParcialUnidadeMedidaDto.termoDePesquisa}%`,
        })
        .orWhere('LOWER(unidadeMedida.descricao) LIKE LOWER(:termo)', {
          termo: `%${obterParcialUnidadeMedidaDto.termoDePesquisa}%`,
        });
    }
    query.orderBy('unidadeMedida.id', 'ASC');
    const result = await query.getMany();
    return result;
  }

  async existeUnidadeMedida(sigla: string, descricao: string) {
    return await this.count({
      where: [{ sigla }, { descricao }],
    });
  }

  async obterPelaSigla(sigla: string): Promise<UnidadesMedidas> {
    return await this.findOne({
      where: { sigla },
    });
  }

  async obterPelaDescricao(descricao: string): Promise<UnidadesMedidas> {
    return await this.findOne({
      where: { descricao },
    });
  }

  async excluir(id: number) {
    const unidadeMedida = await this.obterPorId(id);

    return await this.remove(unidadeMedida);
  }
}
