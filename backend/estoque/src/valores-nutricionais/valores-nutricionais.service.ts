import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateValoresNutricionaiDto } from './dto/create-valores-nutricionai.dto';
import { UpdateValoresNutricionaiDto } from './dto/update-valores-nutricionai.dto';
import { ValoresNutricionais } from './entities/valor-nutricional.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ValoresNutricionaisService {
  @InjectRepository(ValoresNutricionais)
  private readonly valorNutricionalRepository: Repository<ValoresNutricionais>;

  create(createValoresNutricionaiDto: CreateValoresNutricionaiDto) {
    const valorNutricional = this.valorNutricionalRepository.create({
      ...createValoresNutricionaiDto,
    });

    return this.valorNutricionalRepository.save(valorNutricional);
  }

  async update(
    id: number,
    updateValoresNutricionaiDto: UpdateValoresNutricionaiDto,
  ) {
    const valorNutricional = await this.valorNutricionalRepository.preload({
      ...updateValoresNutricionaiDto,
      id,
    });

    if (!valorNutricional) {
      throw new NotFoundException(
        `Nenhum valor nutricional encontrado para o id ${id}`,
      );
    }

    return this.valorNutricionalRepository.save(valorNutricional);
  }

  async findAll() {
    return await this.valorNutricionalRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.valorNutricionalRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    const valorNutricional = await this.valorNutricionalRepository.findOne({
      where: { id },
    });

    if (!valorNutricional) {
      throw new NotFoundException(
        `Nenhum valor nutricional encontrado para o id ${id}`,
      );
    }

    return this.valorNutricionalRepository.remove(valorNutricional);
  }
}
