import { DataSource, Repository } from 'typeorm';
import { Fornecedores } from './entities/fornecedor.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFornecedoreDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedoreDto } from './dto/update-fornecedor.dto';
import { ObterParcialFornecedorDto } from './dto/obter-parcial-fornecedores.dto';

@Injectable()
export class FornecedoresRepository extends Repository<Fornecedores> {
  constructor(private dataSource: DataSource) {
    super(Fornecedores, dataSource.createEntityManager());
  }

  async createFornecedor(
    createFornecedoreDto: CreateFornecedoreDto,
  ): Promise<Fornecedores> {
    const fornecedor = await this.create({
      ...createFornecedoreDto,
    });

    return await this.save(fornecedor);
  }

  async updateFornecedor(
    id: number,
    updateFornecedoreDto: UpdateFornecedoreDto,
  ) {
    const fornecedor = await this.preload({
      ...updateFornecedoreDto,
      id,
    });

    if (!fornecedor) {
      throw new NotFoundException(
        `Nenhum fornecedor encontrado para o id ${id}`,
      );
    }

    return await this.save(fornecedor);
  }

  async obterPorId(id: number): Promise<Fornecedores> {
    return await this.findOne({
      where: { id },
      relations: ['endereco', 'endereco.municipio', 'endereco.municipio.uf'],
    });
  }

  async obterTodos() {
    return await this.find({
      relations: ['endereco', 'endereco.municipio', 'endereco.municipio.uf'],
      order: {
        id: 'ASC',
      },
    });
  }
  async obterParcial(
    obterParcialFornecedorDto: ObterParcialFornecedorDto,
  ): Promise<Fornecedores[]> {
    let query = await this.createQueryBuilder('fornecedor');

    if (obterParcialFornecedorDto.termoDePesquisa) {
      query = query
        .where('LOWER(fornecedor.cnpj) LIKE LOWER(:termo)', {
          termo: `%${obterParcialFornecedorDto.termoDePesquisa}%`,
        })
        .orWhere('LOWER(fornecedor.telefone) LIKE LOWER(:termo)', {
          termo: `%${obterParcialFornecedorDto.termoDePesquisa}%`,
        })
        .orWhere('LOWER(fornecedor.razaoSocial) LIKE LOWER(:termo)', {
          termo: `%${obterParcialFornecedorDto.termoDePesquisa}%`,
        });
    }

    query.orderBy('fornecedor.id', 'ASC');
    const result = await query.getMany();
    return result;
  }

  async obterPeloCnpj(cnpj: string) {
    return await this.findOne({
      where: { cnpj },
    });
  }

  async existeFornecedor(cnpj: string) {
    return await this.count({
      where: { cnpj: cnpj },
    });
  }

  async excluir(id: number) {
    const fornecedor = await this.obterPorId(id);

    return await this.remove(fornecedor);
  }
}
