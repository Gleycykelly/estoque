import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { Marcas } from './entities/marca.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObterParcialMarcaDto } from './dto/obter-parcial-marca.dto';

@Injectable()
export class MarcasService {
  @InjectRepository(Marcas)
  private readonly marcasRepository: Repository<Marcas>;

  async create(createMarcaDto: CreateMarcaDto) {
    await this.marcaJaCadastrada(createMarcaDto.descricao);

    const marca = this.marcasRepository.create({
      ...createMarcaDto,
    });

    return this.marcasRepository.save(marca);
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    const JaCadastrado = await this.marcaJaCadastrada(
      updateMarcaDto.descricao,
      true,
    );

    if (JaCadastrado) {
      const marcaAtual = await this.marcasRepository.findOne({
        where: { descricao: updateMarcaDto.descricao },
      });

      if (marcaAtual.id != id) {
        throw new ConflictException(
          `A marca ${updateMarcaDto.descricao} já está cadastrada!`,
        );
      }
    }

    const marca = await this.marcasRepository.preload({
      ...updateMarcaDto,
      id,
    });

    if (!marca) {
      throw new NotFoundException(`Nenhum marca encontrada para o id ${id}`);
    }

    return this.marcasRepository.save(marca);
  }

  async findAll() {
    return await this.marcasRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.marcasRepository.findOne({
      where: { id },
    });
  }

  async obterParcial(
    obterParcialMarcaDto: ObterParcialMarcaDto,
  ): Promise<Marcas[]> {
    if (!obterParcialMarcaDto.termoDePesquisa) {
      return this.findAll();
    }
    return await this.marcasRepository
      .createQueryBuilder('marca')
      .where('LOWER(marca.descricao) LIKE LOWER(:termo)', {
        termo: `%${obterParcialMarcaDto.termoDePesquisa}%`,
      })
      .getMany();
  }

  async remove(id: number) {
    try {
      const marca = await this.findOne(id);

      return await this.marcasRepository.remove(marca);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir a marca porque há produtos associados a ela.',
      );
    }
  }

  async marcaJaCadastrada(descricao: string, ehAtualizacao = false) {
    const jaExiste = await this.marcasRepository.count({
      where: { descricao: descricao },
    });

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(`A marca ${descricao} já está cadastrada!`);
    } else if (jaExiste) {
      return true;
    }

    return false;
  }
}
