import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enderecos } from './entities/endereco.entity';
import { Repository } from 'typeorm';
import { Municipios } from 'src/municipios/entities/municipio.entity';
import { MunicipiosService } from 'src/municipios/municipios.service';

@Injectable()
export class EnderecosService {
  constructor(private readonly municipioService: MunicipiosService) {}
  @InjectRepository(Enderecos)
  private readonly enderecoRepository: Repository<Enderecos>;

  @InjectRepository(Municipios)
  private readonly municipiosRepository: Repository<Municipios>;

  async create(createEnderecoDto: CreateEnderecoDto) {
    createEnderecoDto.municipio = await this.obtemMunicipio(
      createEnderecoDto.municipio,
      this.municipiosRepository,
      'Município não encontrado para o id',
    );

    const endereco = this.enderecoRepository.create({
      ...createEnderecoDto,
    });
    return this.enderecoRepository.save(endereco);
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
    return await this.enderecoRepository.find({
      relations: ['municipio', 'municipio.uf'],
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.enderecoRepository.findOne({
      where: { id },
      relations: ['municipio', 'municipio.uf'],
    });
  }

  async update(
    id: number,
    updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Enderecos> {
    const endereco = await this.enderecoRepository.preload({
      ...updateEnderecoDto,
      id,
    });

    if (!endereco) {
      throw new NotFoundException(`Nenhum depósito econtrado para o id ${id}`);
    }

    return this.enderecoRepository.save(endereco);
  }

  async remove(id: number) {
    const endereco = await this.enderecoRepository.findOne({ where: { id } });

    if (!endereco) {
      throw new NotFoundException(`Nenhum endereço encontrado para o id ${id}`);
    }

    return this.enderecoRepository.remove(endereco);
  }

  public async obtemEndereco(endereco: Enderecos): Promise<Enderecos> {
    if (endereco.id) {
      const enderecoBD = await this.enderecoRepository.findOne({
        where: { id: endereco.id },
      });

      if (!enderecoBD) {
        throw new NotFoundException(
          `Endereço não encontrado para o id ${endereco.id}`,
        );
      }
      return enderecoBD;
    }

    const novoEndereco = await this.enderecoRepository.create({ ...endereco });
    return await this.enderecoRepository.save(novoEndereco);
  }
}
