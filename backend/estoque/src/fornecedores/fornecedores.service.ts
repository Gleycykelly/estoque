import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFornecedoreDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedoreDto } from './dto/update-fornecedor.dto';
import { Fornecedores } from './entities/fornecedor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ObterParcialFornecedorDto } from './dto/obter-parcial-fornecedores.dto';
import { EnderecosService } from 'src/enderecos/enderecos.service';
import { Repository } from 'typeorm';

@Injectable()
export class FornecedoresService {
  constructor(private readonly enderecoService: EnderecosService) {}
  @InjectRepository(Fornecedores)
  private readonly fornecedoresRepository: Repository<Fornecedores>;

  async create(createFornecedoreDto: CreateFornecedoreDto) {
    await this.fornecedorJaCadastrado(createFornecedoreDto.cnpj);

    createFornecedoreDto.endereco = await this.obtemEntidadeEstrangeira(
      createFornecedoreDto.endereco,
      this.enderecoService,
    );

    const fornecedor = this.fornecedoresRepository.create({
      ...createFornecedoreDto,
    });

    return this.fornecedoresRepository.save(fornecedor);
  }

  async update(
    id: number,
    updateFornecedoreDto: UpdateFornecedoreDto,
  ): Promise<Fornecedores> {
    updateFornecedoreDto.endereco = await this.obtemEntidadeEstrangeira(
      updateFornecedoreDto.endereco,
      this.enderecoService,
    );

    const JaCadastrado = await this.fornecedorJaCadastrado(
      updateFornecedoreDto.cnpj,
      true,
    );

    if (JaCadastrado) {
      const fornecedorAtual = await this.fornecedoresRepository.findOne({
        where: { cnpj: updateFornecedoreDto.cnpj },
      });

      if (fornecedorAtual.id != id) {
        throw new ConflictException(
          `Já existe um fornecedor cadastrado para o CNPJ ${updateFornecedoreDto.cnpj}`,
        );
      }
    }

    const fornecedor = await this.fornecedoresRepository.preload({
      ...updateFornecedoreDto,
      id,
    });

    if (!fornecedor) {
      throw new NotFoundException(
        `Nenhum fornecedor encontrado para o id ${id}`,
      );
    }

    return this.fornecedoresRepository.save(fornecedor);
  }

  async findAll() {
    return await this.fornecedoresRepository.find({
      relations: ['endereco', 'endereco.municipio', 'endereco.municipio.uf'],
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.fornecedoresRepository.findOne({
      where: { id },
      relations: ['endereco', 'endereco.municipio', 'endereco.municipio.uf'],
    });
  }

  async obterParcial(
    obterParcialFornecedorDto: ObterParcialFornecedorDto,
  ): Promise<Fornecedores[]> {
    if (!obterParcialFornecedorDto.termoDePesquisa) {
      return this.findAll();
    }
    return await this.fornecedoresRepository
      .createQueryBuilder('fornecedor')
      .where('LOWER(fornecedor.cnpj) LIKE LOWER(:termo)', {
        termo: `%${obterParcialFornecedorDto.termoDePesquisa}%`,
      })
      .orWhere('LOWER(fornecedor.telefone) LIKE LOWER(:termo)', {
        termo: `%${obterParcialFornecedorDto.termoDePesquisa}%`,
      })
      .orWhere('LOWER(fornecedor.razaoSocial) LIKE LOWER(:termo)', {
        termo: `%${obterParcialFornecedorDto.termoDePesquisa}%`,
      })
      .getMany();
  }

  async remove(id: number) {
    try {
      const fornecedor = await this.findOne(id);

      return await this.fornecedoresRepository.remove(fornecedor);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir o fornecedor porque há lançamentos de produtos associados a ele.',
      );
    }
  }

  async fornecedorJaCadastrado(cnpj: string, ehAtualizacao = false) {
    const jaExiste = await this.fornecedoresRepository.count({
      where: { cnpj: cnpj },
    });

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(
        `O fornecedor com o CNPJ ${cnpj} já está cadastrado!`,
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
