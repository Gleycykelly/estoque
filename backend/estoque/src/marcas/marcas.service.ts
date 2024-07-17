import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { Marcas } from './entities/marca.entity';
import { ObterParcialMarcaDto } from './dto/obter-parcial-marca.dto';
import { MarcasRepository } from './marcas.repository';

@Injectable()
export class MarcasService {
  constructor(private readonly repositorio: MarcasRepository) {}

  async create(createMarcaDto: CreateMarcaDto) {
    await this.marcaJaCadastrada(createMarcaDto.descricao);

    return await this, this.repositorio.createMarcas(createMarcaDto);
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    const JaCadastrado = await this.marcaJaCadastrada(
      updateMarcaDto.descricao,
      true,
    );

    if (JaCadastrado) {
      const marcaAtual = await this.repositorio.obterPelaDescricao(
        updateMarcaDto.descricao,
      );

      if (marcaAtual.id != id) {
        throw new ConflictException(
          `A marca ${updateMarcaDto.descricao} já está cadastrada!`,
        );
      }
    }

    return await this.repositorio.updateMarcas(id, updateMarcaDto);
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async obterParcial(
    obterParcialMarcaDto: ObterParcialMarcaDto,
  ): Promise<Marcas[]> {
    return await this.repositorio.obterParcial(obterParcialMarcaDto);
  }

  async remove(id: number) {
    try {
      return await this.repositorio.excluir(id);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir a marca porque há produtos associados a ela.',
      );
    }
  }

  async marcaJaCadastrada(descricao: string, ehAtualizacao = false) {
    const jaExiste = await this.repositorio.existeMarca(descricao);

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(`A marca ${descricao} já está cadastrada!`);
    } else if (jaExiste) {
      return true;
    }

    return false;
  }
}
