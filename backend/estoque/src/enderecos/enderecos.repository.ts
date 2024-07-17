import { DataSource, Repository } from 'typeorm';
import { Enderecos } from './entities/endereco.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';

@Injectable()
export class EnderecosRepository extends Repository<Enderecos> {
  constructor(private dataSource: DataSource) {
    super(Enderecos, dataSource.createEntityManager());
  }

  async createEndereco(
    createEnderecoDto: CreateEnderecoDto,
  ): Promise<Enderecos> {
    const endereco = await this.create({
      ...createEnderecoDto,
    });
    return await this.save(endereco);
  }

  async obterTodos() {
    return await this.find({
      relations: ['municipio', 'municipio.uf'],
      order: {
        id: 'ASC',
      },
    });
  }

  async obterPorId(id: number): Promise<Enderecos> {
    return await this.findOne({
      where: { id },
      relations: ['municipio', 'municipio.uf'],
    });
  }

  async updateEndereco(
    id: number,
    updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Enderecos> {
    const endereco = await this.preload({
      ...updateEnderecoDto,
      id,
    });

    if (!endereco) {
      throw new NotFoundException(`Nenhum depósito encontrado para o id ${id}`);
    }

    return await this.save(endereco);
  }

  async excluir(id: number) {
    const endereco = await this.obterPorId(id);

    return await this.remove(endereco);
  }
}
