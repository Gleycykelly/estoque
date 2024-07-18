import { Injectable } from '@nestjs/common';
import { Municipios } from './entities/municipio.entity';
import { ObterParcialMunicipiosDto } from './dto/obter-parcial-municipios.dto';
import { MunicipiosRepository } from './municipios.repository';

@Injectable()
export class MunicipiosService {
  constructor(private repositorio: MunicipiosRepository) {}

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async obterParcial(
    obterParcialMunicipiosDto: ObterParcialMunicipiosDto,
  ): Promise<Municipios[]> {
    return await this.repositorio.obterParcial(obterParcialMunicipiosDto);
  }
}
