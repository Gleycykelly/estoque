import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Depositos } from './entities/deposito.entity';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
import { ObterParcialDepositoDto } from './dto/obter-parcial-deposito.dto';

@Injectable()
export class DepositosRepository extends Repository<Depositos> {
  constructor(private dataSource: DataSource) {
    super(Depositos, dataSource.createEntityManager());
  }

  async createDeposito(
    createDepositoDto: CreateDepositoDto,
  ): Promise<Depositos> {
    const deposito = await this.create({
      ...createDepositoDto,
    });

    return this.save(deposito);
  }

  async updateDeposito(
    id: number,
    updateDepositoDto: UpdateDepositoDto,
  ): Promise<Depositos> {
    const deposito = await this.preload({
      ...updateDepositoDto,
      id,
    });

    if (!deposito) {
      throw new NotFoundException(`Nenhum depósito encontrado para o id ${id}`);
    }

    return await this.save(deposito);
  }

  async obterPorId(id: number) {
    return await this.findOne({
      relations: ['endereco', 'endereco.municipio', 'endereco.municipio.uf'],
      where: { id },
    });
  }

  async obterParcial(obterParcialDepositoDto: ObterParcialDepositoDto) {
    let query = await this.createQueryBuilder('deposito');

    if (obterParcialDepositoDto.termoDePesquisa) {
      query = query.where('LOWER(deposito.descricao) LIKE LOWER(:termo)', {
        termo: `%${obterParcialDepositoDto.termoDePesquisa}%`,
      });
    }

    if (
      obterParcialDepositoDto.depositos != null &&
      obterParcialDepositoDto.depositos.length > 0
    ) {
      query = query.where('deposito.id in (:...depositos)', {
        depositos: obterParcialDepositoDto.depositos,
      });
    }

    query.orderBy('deposito.id', 'ASC');
    const result = await query.getMany();
    return result;
  }

  async obterPelaDescricao(descricao: string) {
    return await this.findOne({ where: { descricao: descricao } });
  }

  async existeDeposito(descricao: string) {
    return await this.count({ where: { descricao: descricao } });
  }

  async obterTodos(): Promise<Depositos[]> {
    return await this.find({
      relations: ['endereco', 'endereco.municipio', 'endereco.municipio.uf'],
      order: {
        id: 'ASC',
      },
    });
  }

  async excluir(id: number) {
    const deposito = await this.obterPorId(id);

    return await this.remove(deposito);
  }
}
