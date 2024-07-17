import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Categorias } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { ObterParcialCategoriaDto } from './dto/obter-parcial-categoria.dto';
import { CategoriasRepository } from './categorias.repository';

@Injectable()
export class CategoriasService {
  constructor(private repositorio: CategoriasRepository) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    await this.categoriaJaExiste(createCategoriaDto.descricao);

    this.repositorio.createCategoria(createCategoriaDto);
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const jaExiste = await this.categoriaJaExiste(
      updateCategoriaDto.descricao,
      true,
    );

    if (jaExiste) {
      const categoriaAtual = await this.repositorio.obterPelaDescricao(
        updateCategoriaDto.descricao,
      );

      if (categoriaAtual.id != id) {
        throw new ConflictException(
          `A categoria ${updateCategoriaDto.descricao} já existe!`,
        );
      }
    }

    this.repositorio.updateCategoria(id, updateCategoriaDto);
  }

  async findOne(id: number): Promise<Categorias> {
    const categoria = await this.repositorio.obterPorId(id);

    if (!categoria) {
      throw new NotFoundException(
        `Nenhuma categoria encontrada para o id ${id}`,
      );
    }

    return categoria;
  }

  async findAll(): Promise<Categorias[]> {
    return await this.repositorio.obterTodos();
  }

  async obterParcial(
    obterParcialCategoriaDto: ObterParcialCategoriaDto,
  ): Promise<Categorias[]> {
    return await this.repositorio.obterParcial(obterParcialCategoriaDto);
  }

  async remove(id: number) {
    try {
      await this.repositorio.excluir(id);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir a categoria porque há produtos associados a ela.',
      );
    }
  }

  async categoriaJaExiste(descricao: string, ehAtualizacao = false) {
    const jaExiste = await this.repositorio.categoriaJaExiste(descricao);

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(`A categoria ${descricao} já existe!`);
    } else if (jaExiste) {
      return true;
    }

    return false;
  }
}
