import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Categorias } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { ObterParcialCategoriaDto } from './dto/obter-parcial-categoria.dto';

@Injectable()
export class CategoriasRepository extends Repository<Categorias> {
  constructor(private dataSource: DataSource) {
    super(Categorias, dataSource.createEntityManager());
  }

  async createCategoria(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<Categorias> {
    const categoria = await this.create({
      ...createCategoriaDto,
    });

    return await this.save(categoria);
  }

  async updateCategoria(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categorias> {
    const categoria = await this.preload({
      ...updateCategoriaDto,
      id,
    });

    if (!categoria) {
      throw new NotFoundException(
        `Nenhuma categoria encontrada para o id ${id}`,
      );
    }

    return await this.save(categoria);
  }

  async obterPorId(id: number) {
    return await this.findOne({
      where: { id },
    });
  }

  async obterParcial(obterParcialCategoriaDto: ObterParcialCategoriaDto) {
    let query = await this.createQueryBuilder('categoria');

    if (obterParcialCategoriaDto.termoDePesquisa) {
      query = query.where('LOWER(categoria.descricao) LIKE LOWER(:termo)', {
        termo: `%${obterParcialCategoriaDto.termoDePesquisa}%`,
      });
    }

    query.orderBy('categoria.id', 'ASC');
    const result = await query.getMany();
    return result;
  }

  async obterPelaDescricao(descricao: string) {
    return await this.findOne({ where: { descricao: descricao } });
  }

  async categoriaJaExiste(descricao: string) {
    return await this.count({ where: { descricao: descricao } });
  }

  async obterTodos(): Promise<Categorias[]> {
    return await this.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async excluir(id: number) {
    const categoria = await this.obterPorId(id);

    return await this.remove(categoria);
  }
}
