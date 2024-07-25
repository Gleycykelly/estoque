import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFornecedoreDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedoreDto } from './dto/update-fornecedor.dto';
import { Fornecedores } from './entities/fornecedor.entity';
import { ObterParcialFornecedorDto } from './dto/obter-parcial-fornecedores.dto';
import { EnderecosService } from 'src/enderecos/enderecos.service';
import { FornecedoresRepository } from './fornecedores.repository';

@Injectable()
export class FornecedoresService {
  constructor(
    private repositorio: FornecedoresRepository,
    private readonly enderecoService: EnderecosService,
  ) {}

  async create(createFornecedoreDto: CreateFornecedoreDto) {
    await this.fornecedorJaCadastrado(createFornecedoreDto.cnpj);

    createFornecedoreDto.endereco = await this.obtemEntidadeEstrangeira(
      createFornecedoreDto.endereco,
      this.enderecoService,
    );

    return await this.repositorio.createFornecedor(createFornecedoreDto);
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
      const fornecedorAtual = await this.repositorio.obterPeloCnpj(
        updateFornecedoreDto.cnpj,
      );

      if (fornecedorAtual && fornecedorAtual.id != id) {
        throw new ConflictException(
          `Já existe um fornecedor cadastrado para o CNPJ ${updateFornecedoreDto.cnpj}`,
        );
      }
    }

    return await this.repositorio.updateFornecedor(id, updateFornecedoreDto);
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async obterParcial(
    obterParcialFornecedorDto: ObterParcialFornecedorDto,
  ): Promise<Fornecedores[]> {
    return await this.repositorio.obterParcial(obterParcialFornecedorDto);
  }

  async remove(id: number) {
    try {
      return await this.repositorio.excluir(id);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir o fornecedor porque há lançamentos de produtos associados a ele.',
      );
    }
  }

  async fornecedorJaCadastrado(cnpj: string, ehAtualizacao = false) {
    const jaExiste = await this.repositorio.existeFornecedor(cnpj);

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
      return await service.update(entidadeBD.id, entidade);
    }

    return await service.create({ ...entidade });
  }
}
