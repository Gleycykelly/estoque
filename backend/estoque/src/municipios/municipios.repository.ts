import { Injectable, NotFoundException } from '@nestjs/common';
import { Municipios } from './entities/municipio.entity';
import { DataSource, Repository } from 'typeorm';
import { ObterParcialMunicipiosDto } from './dto/obter-parcial-municipios.dto';

@Injectable()
export class MunicipiosRepository extends Repository<Municipios> {
  constructor(private dataSource: DataSource) {
    super(Municipios, dataSource.createEntityManager());
  }

  async obterTodos(): Promise<Municipios[]> {
    return await this.find({ relations: ['uf'] });
  }

  async obterPorId(id: number): Promise<Municipios> {
    const municipio = await this.findOne({
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
    let query = await this.createQueryBuilder('municipio');

    if (obterParcialMunicipiosDto.termoDePesquisa) {
      query = query.where('LOWER(municipio.nome) LIKE LOWER(:termo)', {
        termo: `%${obterParcialMunicipiosDto.termoDePesquisa}%`,
      });
    }

    if (obterParcialMunicipiosDto.uf) {
      query = query.where('LOWER(municipio.uf) LIKE LOWER(:uf)', {
        uf: `%${obterParcialMunicipiosDto.uf}%`,
      });
    }

    query.orderBy('municipio.id', 'ASC');
    const result = await query.getMany();
    return result;
  }
}
