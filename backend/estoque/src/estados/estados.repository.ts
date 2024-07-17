import { DataSource, Repository } from 'typeorm';
import { Estados } from './entities/estado.entity';
import { Injectable } from '@nestjs/common';
import { ObterParcialEstadosDto } from './dto/obter-parcial-estados.dto';

@Injectable()
export class EstadosRepository extends Repository<Estados> {
  constructor(private dataSource: DataSource) {
    super(Estados, dataSource.createEntityManager());
  }

  async obterTodos(): Promise<Estados[]> {
    return await this.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async obterPorId(id: number) {
    return await this.findOne({ where: { id } });
  }

  async obterParcial(
    obterParcialEstadosDto: ObterParcialEstadosDto,
  ): Promise<Estados[]> {
    let query = await this.createQueryBuilder('estado');

    if (obterParcialEstadosDto.termoDePesquisa) {
      query = query.where('LOWER(estado.nome) LIKE LOWER(:termo)', {
        termo: `%${obterParcialEstadosDto.termoDePesquisa}%`,
      });
    }

    query.orderBy('estado.id', 'ASC');
    const result = await query.getMany();
    return result;
  }
}
