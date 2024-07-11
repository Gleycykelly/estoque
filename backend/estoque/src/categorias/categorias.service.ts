import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Categorias } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Repository } from 'typeorm';
import { ObterParcialCategoriaDto } from './dto/obter-parcial-categoria.dto';

@Injectable()
export class CategoriasService {
  @InjectRepository(Categorias)
  private readonly categoriaRepository: Repository<Categorias>;

  async create(createCategoriaDto: CreateCategoriaDto) {
    await this.categoriaJaExiste(createCategoriaDto.descricao);

    const categoria = await this.categoriaRepository.create({
      ...createCategoriaDto,
    });

    return this.categoriaRepository.save(categoria);
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const jaExiste = await this.categoriaJaExiste(
      updateCategoriaDto.descricao,
      true,
    );

    if (jaExiste) {
      const categoriaAtual = await this.categoriaRepository.findOne({
        where: { descricao: updateCategoriaDto.descricao },
      });

      if (categoriaAtual.id != id) {
        throw new ConflictException(
          `A categoria ${updateCategoriaDto.descricao} já existe!`,
        );
      }
    }

    const categoria = await this.categoriaRepository.preload({
      ...updateCategoriaDto,
      id,
    });

    if (!categoria) {
      throw new NotFoundException(
        `Nenhuma categoria encontrada para o id ${id}`,
      );
    }

    return this.categoriaRepository.save(categoria);
  }

  async findOne(id: number): Promise<Categorias> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException(
        `Nenhuma categoria encontrada para o id ${id}`,
      );
    }

    return categoria;
  }

  async findAll(): Promise<Categorias[]> {
    return await this.categoriaRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async obterParcial(
    obterParcialCategoriaDto: ObterParcialCategoriaDto,
  ): Promise<Categorias[]> {
    if (!obterParcialCategoriaDto.termoDePesquisa) {
      return this.findAll();
    }

    return await this.categoriaRepository
      .createQueryBuilder('categoria')
      .where('LOWER(categoria.descricao) LIKE LOWER(:termo)', {
        termo: `%${obterParcialCategoriaDto.termoDePesquisa}%`,
      })
      .getMany();
  }

  async remove(id: number) {
    try {
      const categoria = await this.findOne(id);

      return await this.categoriaRepository.remove(categoria);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir a categoria porque há produtos associados a ela.',
      );
    }
  }

  async categoriaJaExiste(descricao: string, ehAtualizacao = false) {
    const jaExiste = await this.categoriaRepository.count({
      where: { descricao: descricao },
    });

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(`A categoria ${descricao} já existe!`);
    } else if (jaExiste) {
      return true;
    }

    return false;
  }
}
