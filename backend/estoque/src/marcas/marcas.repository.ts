import { Injectable, NotFoundException } from '@nestjs/common';
import { Marcas } from './entities/marca.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { ObterParcialMarcaDto } from './dto/obter-parcial-marca.dto';

@Injectable()
export class MarcasRepository extends Repository<Marcas> {
  constructor(private dataSource: DataSource) {
    super(Marcas, dataSource.createEntityManager());
  }

  async createMarcas(createMarcaDto: CreateMarcaDto): Promise<Marcas> {
    const marca = await this.create({
      ...createMarcaDto,
    });

    return await this.save(marca);
  }

  async updateMarcas(
    id: number,
    updateMarcaDto: UpdateMarcaDto,
  ): Promise<Marcas> {
    const marca = await this.preload({
      ...updateMarcaDto,
      id,
    });

    if (!marca) {
      throw new NotFoundException(`Nenhum marca encontrada para o id ${id}`);
    }

    return await this.save(marca);
  }

  async obterPorId(id: number): Promise<Marcas> {
    return await this.findOne({
      where: { id },
    });
  }

  async obterTodos(): Promise<Marcas[]> {
    return await this.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async obterParcial(
    obterParcialMarcaDto: ObterParcialMarcaDto,
  ): Promise<Marcas[]> {
    let query = await this.createQueryBuilder('marca');

    if (obterParcialMarcaDto.termoDePesquisa) {
      query = query.where('LOWER(marca.descricao) LIKE LOWER(:termo)', {
        termo: `%${obterParcialMarcaDto.termoDePesquisa}%`,
      });
    }

    query.orderBy('marca.id', 'ASC');
    const result = await query.getMany();
    return result;
  }

  async obterPelaDescricao(descricao: string) {
    return await this.findOne({
      where: { descricao },
    });
  }

  async existeMarca(descricao: string) {
    return await this.count({
      where: { descricao: descricao },
    });
  }

  async excluir(id: number) {
    const marca = await this.obterPorId(id);

    return await this.remove(marca);
  }
}
