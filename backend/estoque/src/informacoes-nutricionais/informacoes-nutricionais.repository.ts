import { DataSource, Repository } from 'typeorm';
import { InformacoesNutricionais } from './entities/informacao-nutricional.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInformacaoNutricionalDto } from './dto/create-informacao-nutricional.dto';
import { UpdateInformacaoNutricionalDto } from './dto/update-informacao-nutricional.dto';

@Injectable()
export class InformacoesNutricionaisRepository extends Repository<InformacoesNutricionais> {
  constructor(private dataSource: DataSource) {
    super(InformacoesNutricionais, dataSource.createEntityManager());
  }

  async createInformacoesNutricionais(
    createInformacaoNutricional: CreateInformacaoNutricionalDto,
  ): Promise<InformacoesNutricionais> {
    const informacaoNutricional = await this.create({
      ...createInformacaoNutricional,
    });

    return await this.save(informacaoNutricional);
  }

  async updateInformacaoNutricional(
    id: number,
    updateInformacaoNutricionalDto: UpdateInformacaoNutricionalDto,
  ) {
    const informacaoNutricional = await this.preload({
      ...updateInformacaoNutricionalDto,
      id,
    });

    if (!informacaoNutricional) {
      throw new NotFoundException(
        `Nenhuma informação nutricional encontrada para o id ${id}`,
      );
    }

    return await this.save(informacaoNutricional);
  }

  async obterTodos(): Promise<InformacoesNutricionais[]> {
    return await this.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async obterPorId(id: number): Promise<InformacoesNutricionais> {
    return await this.findOne({
      where: { id },
    });
  }

  async excluir(id: number) {
    const informacaoNutricional = await this.findOne({ where: { id } });

    if (!informacaoNutricional) {
      throw new NotFoundException(
        `Nenhuma informação nutricional encontrada para o id ${id}`,
      );
    }

    return await this.remove(informacaoNutricional);
  }
}
