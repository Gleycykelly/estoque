import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnidadesMedidaDto } from './dto/create-unidades_medida.dto';
import { UpdateUnidadesMedidaDto } from './dto/update-unidades_medida.dto';
import { UnidadesMedidas } from './entities/unidades_medida.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObterParcialUnidadeMedidaDto } from './dto/obter-parcial-unidade-medida.dto';

@Injectable()
export class UnidadesMedidasService {
  @InjectRepository(UnidadesMedidas)
  private readonly unidadeMedidaRepository: Repository<UnidadesMedidas>;

  async create(createUnidadesMedidaDto: CreateUnidadesMedidaDto) {
    await this.unidadeJacadastrada(
      createUnidadesMedidaDto.sigla,
      createUnidadesMedidaDto.descricao,
    );

    const unidadeMedida = this.unidadeMedidaRepository.create({
      ...createUnidadesMedidaDto,
    });

    return this.unidadeMedidaRepository.save(unidadeMedida);
  }

  async update(id: number, updateUnidadesMedidaDto: UpdateUnidadesMedidaDto) {
    const JaCadastrado = await this.unidadeJacadastrada(
      updateUnidadesMedidaDto.sigla,
      updateUnidadesMedidaDto.descricao,
      true,
    );

    if (JaCadastrado) {
      const unidadeAtualSigla = await this.unidadeMedidaRepository.findOne({
        where: { sigla: updateUnidadesMedidaDto.sigla },
      });

      if (unidadeAtualSigla.id != id) {
        throw new ConflictException(
          `Já existe uma unidade de medida cadastrada com a sigla ${updateUnidadesMedidaDto.sigla}!`,
        );
      }

      const unidadeAtualDescricao = await this.unidadeMedidaRepository.findOne({
        where: { descricao: updateUnidadesMedidaDto.descricao },
      });

      if (unidadeAtualDescricao.id != id) {
        throw new ConflictException(
          `Já existe uma unidade de medida cadastrada com a descrição ${updateUnidadesMedidaDto.descricao}!`,
        );
      }
    }

    const unidadeMedida = await this.unidadeMedidaRepository.preload({
      ...updateUnidadesMedidaDto,
      id,
    });

    if (!unidadeMedida) {
      throw new NotFoundException(
        `Nenhuma unidade de medida encontrada para o id ${id}`,
      );
    }

    return this.unidadeMedidaRepository.save(unidadeMedida);
  }

  async findAll() {
    return await this.unidadeMedidaRepository.find({
      order: {
        id: 'ASC',
        porcoes: { id: 'ASC' },
      },
    });
  }

  async findOne(id: number) {
    return await this.unidadeMedidaRepository.findOne({
      where: { id },
    });
  }

  async obterParcial(
    obterParcialUnidadeMedidaDto: ObterParcialUnidadeMedidaDto,
  ): Promise<UnidadesMedidas[]> {
    if (!obterParcialUnidadeMedidaDto.termoDePesquisa) {
      return this.findAll();
    }
    return await this.unidadeMedidaRepository
      .createQueryBuilder('unidadeMedida')
      .where('LOWER(unidadeMedida.sigla) LIKE LOWER(:termo)', {
        termo: `%${obterParcialUnidadeMedidaDto.termoDePesquisa}%`,
      })
      .orWhere('LOWER(unidadeMedida.descricao) LIKE LOWER(:termo)', {
        termo: `%${obterParcialUnidadeMedidaDto.termoDePesquisa}%`,
      })
      .getMany();
  }

  async remove(id: number) {
    try {
      const unidadeMedida = await this.findOne(id);

      return await this.unidadeMedidaRepository.remove(unidadeMedida);
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
    const jaExiste = await this.unidadeMedidaRepository.count({
      where: [{ sigla: sigla }, { descricao: descricao }],
    });

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
