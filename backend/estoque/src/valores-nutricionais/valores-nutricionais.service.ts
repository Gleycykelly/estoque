import { ConflictException, Injectable } from '@nestjs/common';
import { CreateValoresNutricionaiDto } from './dto/create-valores-nutricionai.dto';
import { UpdateValoresNutricionaiDto } from './dto/update-valores-nutricionai.dto';
import { ValoresNutricionaisRepository } from './valores-nutriconais.repository';

@Injectable()
export class ValoresNutricionaisService {
  constructor(private readonly repositorio: ValoresNutricionaisRepository) {}

  async create(createValoresNutricionaiDto: CreateValoresNutricionaiDto) {
    return await this.repositorio.createValoresNutricionais(
      createValoresNutricionaiDto,
    );
  }

  async update(
    id: number,
    updateValoresNutricionaiDto: UpdateValoresNutricionaiDto,
  ) {
    return await this.repositorio.updateValoresNutricionais(
      id,
      updateValoresNutricionaiDto,
    );
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async remove(id: number) {
    try {
      return await this.repositorio.excluir(id);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir os valores nutricionais"!.',
      );
    }
  }
}
