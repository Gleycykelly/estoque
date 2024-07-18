import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUnidadesMedidaDto } from './dto/create-unidades_medida.dto';
import { UpdateUnidadesMedidaDto } from './dto/update-unidades_medida.dto';
import { UnidadesMedidas } from './entities/unidades_medida.entity';
import { ObterParcialUnidadeMedidaDto } from './dto/obter-parcial-unidade-medida.dto';
import { UnidadesMedidasRepository } from './unidades_medidas.repository';

@Injectable()
export class UnidadesMedidasService {
  constructor(private readonly respositorio: UnidadesMedidasRepository) {}

  async create(createUnidadesMedidaDto: CreateUnidadesMedidaDto) {
    await this.unidadeJacadastrada(
      createUnidadesMedidaDto.sigla,
      createUnidadesMedidaDto.descricao,
    );

    return await this.respositorio.createUnidadeMedida(createUnidadesMedidaDto);
  }

  async update(id: number, updateUnidadesMedidaDto: UpdateUnidadesMedidaDto) {
    const JaCadastrado = await this.unidadeJacadastrada(
      updateUnidadesMedidaDto.sigla,
      updateUnidadesMedidaDto.descricao,
      true,
    );

    if (JaCadastrado) {
      const unidadeAtualSigla = await this.respositorio.obterPelaSigla(
        updateUnidadesMedidaDto.sigla,
      );

      if (unidadeAtualSigla.id != id) {
        throw new ConflictException(
          `Já existe uma unidade de medida cadastrada com a sigla ${updateUnidadesMedidaDto.sigla}!`,
        );
      }

      const unidadeAtualDescricao = await this.respositorio.obterPelaDescricao(
        updateUnidadesMedidaDto.descricao,
      );

      if (unidadeAtualDescricao.id != id) {
        throw new ConflictException(
          `Já existe uma unidade de medida cadastrada com a descrição ${updateUnidadesMedidaDto.descricao}!`,
        );
      }
    }
    return await this.respositorio.updateUnidadeMedida(
      id,
      updateUnidadesMedidaDto,
    );
  }

  async findAll() {
    return await this.respositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.respositorio.obterPorId(id);
  }

  async obterParcial(
    obterParcialUnidadeMedidaDto: ObterParcialUnidadeMedidaDto,
  ): Promise<UnidadesMedidas[]> {
    return await this.respositorio.obterParcial(obterParcialUnidadeMedidaDto);
  }

  async remove(id: number) {
    try {
      return await this.respositorio.excluir(id);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir a unidade de medida porque há produtos associados a ela.',
      );
    }
  }

  private async unidadeJacadastrada(
    sigla: string,
    descricao: string,
    ehAtualizacao = false,
  ) {
    const jaExiste = await this.respositorio.existeUnidadeMedida(
      sigla,
      descricao,
    );

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(
        `Já existe um produto cadastrado com essa sigla e/ou descrição!`,
      );
    } else if (jaExiste) {
      return true;
    }

    return false;
  }
}
