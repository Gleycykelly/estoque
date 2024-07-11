import { Injectable, NotFoundException } from '@nestjs/common';
import { Municipios } from './entities/municipio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObterParcialMunicipiosDto } from './dto/obter-parcial-municipios.dto';

@Injectable()
export class MunicipiosService {
  @InjectRepository(Municipios)
  private readonly municipiosRepository: Repository<Municipios>;

  async findAll() {
    return await this.municipiosRepository.find({ relations: ['uf'] });
  }

  async findOne(id: number) {
    const municipio = await this.municipiosRepository.findOne({
      where: { id },
      relations: ['uf'],
    });

    if (!municipio) {
      throw new NotFoundException(`Nenhum município corresponde ao id ${id}`);
    }
    return municipio;
  }

  async obterParcial(
    obterParcialMunicipiosDto: ObterParcialMunicipiosDto,
  ): Promise<Municipios[]> {
    if (!obterParcialMunicipiosDto) {
      return this.findAll();
    }
    return await this.municipiosRepository
      .createQueryBuilder('municipio')
      .where('LOWER(municipio.uf) LIKE LOWER(:termo)', {
        termo: `%${obterParcialMunicipiosDto.termoDePesquisa}%`,
      })
      .orWhere('LOWER(municipio.nome) LIKE LOWER(:termo)', {
        termo: `%${obterParcialMunicipiosDto.termoDePesquisa}%`,
      })
      .getMany();
  }
}
