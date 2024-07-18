import { DataSource, Repository } from 'typeorm';
import { ValoresNutricionais } from './entities/valor-nutricional.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateValoresNutricionaiDto } from './dto/create-valores-nutricionai.dto';
import { UpdateValoresNutricionaiDto } from './dto/update-valores-nutricionai.dto';

@Injectable()
export class ValoresNutricionaisRepository extends Repository<ValoresNutricionais> {
  constructor(private dataSource: DataSource) {
    super(ValoresNutricionais, dataSource.createEntityManager());
  }

  async createValoresNutricionais(
    createValoresNutricionaiDto: CreateValoresNutricionaiDto,
  ): Promise<ValoresNutricionais> {
    const valorNutricional = this.create({
      ...createValoresNutricionaiDto,
    });

    return await this.save(valorNutricional);
  }

  async updateValoresNutricionais(
    id: number,
    updateValoresNutricionaiDto: UpdateValoresNutricionaiDto,
  ): Promise<ValoresNutricionais> {
    const valorNutricional = await this.preload({
      ...updateValoresNutricionaiDto,
      id,
    });

    if (!valorNutricional) {
      throw new NotFoundException(
        `Nenhum valor nutricional encontrado para o id ${id}`,
      );
    }

    return await this.save(valorNutricional);
  }

  async obterTodos(): Promise<ValoresNutricionais[]> {
    return await this.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async obterPorId(id: number): Promise<ValoresNutricionais> {
    return await this.findOne({
      where: { id },
    });
  }

  async excluir(id: number) {
    const valorNutricional = await this.findOne({
      where: { id },
    });

    return await this.remove(valorNutricional);
  }
}
