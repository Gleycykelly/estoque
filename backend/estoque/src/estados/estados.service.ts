import { Injectable } from '@nestjs/common';
import { Estados } from './entities/estado.entity';
import { ObterParcialEstadosDto } from './dto/obter-parcial-estados.dto';
import { EstadosRepository } from './estados.repository';

@Injectable()
export class EstadosService {
  constructor(private repositorio: EstadosRepository) {}

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }
  async obterParcial(
    obterParcialEstadosDto: ObterParcialEstadosDto,
  ): Promise<Estados[]> {
    return await this.repositorio.obterParcial(obterParcialEstadosDto);
  }
}
