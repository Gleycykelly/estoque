import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
import { Depositos } from './entities/deposito.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObterParcialDepositoDto } from './dto/obter-parcial-deposito.dto';
import { EnderecosService } from 'src/enderecos/enderecos.service';

@Injectable()
export class DepositosService {
  constructor(private readonly enderecoService: EnderecosService) {}
  @InjectRepository(Depositos)
  private readonly depositoRepository: Repository<Depositos>;

  async create(createDepositoDto: CreateDepositoDto) {
    await this.depositoJaCadastrado(createDepositoDto.descricao);

    createDepositoDto.endereco = await this.obtemEntidadeEstrangeira(
      createDepositoDto.endereco,
      this.enderecoService,
    );

    const deposito = this.depositoRepository.create({
      ...createDepositoDto,
    });
    return this.depositoRepository.save(deposito);
  }

  async update(id: number, updateDepositoDto: UpdateDepositoDto) {
    const JaCadastrado = await this.depositoJaCadastrado(
      updateDepositoDto.descricao,
      true,
    );

    if (JaCadastrado) {
      const depositoAtual = await this.depositoRepository.findOne({
        where: { descricao: updateDepositoDto.descricao },
      });

      if (depositoAtual.id != id) {
        throw new ConflictException(
          `O depósito ${updateDepositoDto.descricao} já está cadastrado!`,
        );
      }
    }

    updateDepositoDto.endereco = await this.obtemEntidadeEstrangeira(
      updateDepositoDto.endereco,
      this.enderecoService,
    );

    const deposito = await this.depositoRepository.preload({
      ...updateDepositoDto,
      id,
    });

    if (!deposito) {
      throw new NotFoundException(`Nenhum depósito encontrado para o id ${id}`);
    }

    return this.depositoRepository.save(deposito);
  }

  async findAll() {
    return await this.depositoRepository.find({
      relations: ['endereco', 'endereco.municipio', 'endereco.municipio.uf'],
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.depositoRepository.findOne({
      where: { id },
      relations: ['endereco', 'endereco.municipio', 'endereco.municipio.uf'],
    });
  }

  async obterParcial(
    obterParcialDepositoDto: ObterParcialDepositoDto,
  ): Promise<Depositos[]> {
    if (!obterParcialDepositoDto.termoDePesquisa) {
      return this.findAll();
    }
    return await this.depositoRepository
      .createQueryBuilder('deposito')
      .where('LOWER(deposito.descricao) LIKE LOWER(:termo)', {
        termo: `%${obterParcialDepositoDto.termoDePesquisa}%`,
      })
      .getMany();
  }

  async remove(id: number) {
    try {
      const deposito = await this.findOne(id);

      return await this.depositoRepository.remove(deposito);
    } catch (error) {
      throw new ConflictException('Não foi possível excluir o depósito.');
    }
  }

  async depositoJaCadastrado(descricao: string, ehAtualizacao = false) {
    const jaExiste = await this.depositoRepository.count({
      where: { descricao: descricao },
    });

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(
        `O depósito ${descricao} já está cadastrado!`,
      );
    } else if (jaExiste) {
      return true;
    }

    return false;
  }

  private async obtemEntidadeEstrangeira(entidade: any, service: any) {
    if (entidade.id) {
      const entidadeBD = await service.findOne(entidade.id);
      await service.update(entidadeBD.id, entidade);
      return entidadeBD;
    }

    return service.create({ ...entidade });
  }
}
