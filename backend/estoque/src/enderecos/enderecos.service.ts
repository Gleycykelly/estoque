import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enderecos } from './entities/endereco.entity';
import { Repository } from 'typeorm';
import { Municipios } from 'src/municipios/entities/municipio.entity';
import { MunicipiosService } from 'src/municipios/municipios.service';
import { EnderecosRepository } from './enderecos.repository';

@Injectable()
export class EnderecosService {
  constructor(
    private repositorio: EnderecosRepository,
    private readonly municipioService: MunicipiosService,
  ) {}

  @InjectRepository(Municipios)
  private readonly municipiosRepository: Repository<Municipios>;

  async create(createEnderecoDto: CreateEnderecoDto) {
    createEnderecoDto.municipio = await this.obtemMunicipio(
      createEnderecoDto.municipio,
      this.municipiosRepository,
      'Município não encontrado para o id',
    );

    return await this.repositorio.createEndereco(createEnderecoDto);
  }

  private async obtemMunicipio(
    entidade: any,
    repositorio: any,
    mensagemErro: string,
  ) {
    if (entidade.id) {
      const entidadeBD = await repositorio.findOne({
        where: { id: entidade.id },
      });

      if (!entidadeBD) {
        throw new NotFoundException(`${mensagemErro} ${entidade.id}`);
      }
      return entidadeBD;
    } else {
      throw new NotFoundException(`Informe o id do município!`);
    }
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async update(
    id: number,
    updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Enderecos> {
    return await this.repositorio.updateEndereco(id, updateEnderecoDto);
  }

  async remove(id: number) {
    try {
      return await this.repositorio.excluir(id);
    } catch (error) {
      throw new ConflictException('Não foi possível excluir o endereço.');
    }
  }
}
