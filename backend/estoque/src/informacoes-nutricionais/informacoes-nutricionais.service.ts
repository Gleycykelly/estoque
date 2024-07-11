import { Injectable, NotFoundException } from '@nestjs/common';
import { InformacoesNutricionais } from './entities/informacao-nutricional.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInformacaoNutricionalDto } from './dto/create-informacao-nutricional.dto';
import { UpdateInformacaoNutricionalDto } from './dto/update-informacao-nutricional.dto';

@Injectable()
export class InformacoesNutricionaisService {
  @InjectRepository(InformacoesNutricionais)
  private readonly informacaoNutricionalRepository: Repository<InformacoesNutricionais>;

  create(createInformacaoNutricional: CreateInformacaoNutricionalDto) {
    const informacaoNutricional = this.informacaoNutricionalRepository.create({
      ...createInformacaoNutricional,
    });

    return this.informacaoNutricionalRepository.save(informacaoNutricional);
  }

  async update(
    id: number,
    updateInformacaoNutricionalDto: UpdateInformacaoNutricionalDto,
  ) {
    const informacaoNutricional =
      await this.informacaoNutricionalRepository.preload({
        ...updateInformacaoNutricionalDto,
        id,
      });

    if (!informacaoNutricional) {
      throw new NotFoundException(
        `Nenhuma informação nutricional encontrada para o id ${id}`,
      );
    }

    return this.informacaoNutricionalRepository.save(informacaoNutricional);
  }

  async findAll() {
    return await this.informacaoNutricionalRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.informacaoNutricionalRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    const informacaoNutricional =
      await this.informacaoNutricionalRepository.findOne({ where: { id } });

    if (!informacaoNutricional) {
      throw new NotFoundException(
        `Nenhuma informação nutricional encontrada para o id ${id}`,
      );
    }

    return this.informacaoNutricionalRepository.remove(informacaoNutricional);
  }
}
