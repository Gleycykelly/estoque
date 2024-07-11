import { Injectable } from '@nestjs/common';
import { Estados } from './entities/estado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObterParcialEstadosDto } from './dto/obter-parcial-estados.dto';

@Injectable()
export class EstadosService {
  @InjectRepository(Estados)
  private readonly estadosRepository: Repository<Estados>;

  async findAll() {
    return await this.estadosRepository.find();
  }

  async findOne(id: number) {
    return await this.estadosRepository.findOne({
      where: { id },
    });
  }
  async obterParcial(
    obterParcialEstadosDto: ObterParcialEstadosDto,
  ): Promise<Estados[]> {
    if (!obterParcialEstadosDto.termoDePesquisa) {
      return this.findAll();
    }
    return await this.estadosRepository
      .createQueryBuilder('estado')
      .where('LOWER(estado.nome) LIKE LOWER(:termo)', {
        termo: `%${obterParcialEstadosDto.termoDePesquisa}%`,
      })
      .getMany();
  }
}
