import { ConflictException, Injectable } from '@nestjs/common';
import { CreateInformacaoNutricionalDto } from './dto/create-informacao-nutricional.dto';
import { UpdateInformacaoNutricionalDto } from './dto/update-informacao-nutricional.dto';
import { InformacoesNutricionaisRepository } from './informacoes-nutricionais.repository';

@Injectable()
export class InformacoesNutricionaisService {
  constructor(private repositorio: InformacoesNutricionaisRepository) {}

  async create(createInformacaoNutricional: CreateInformacaoNutricionalDto) {
    return await this.repositorio.createInformacoesNutricionais(
      createInformacaoNutricional,
    );
  }

  async update(
    id: number,
    updateInformacaoNutricionalDto: UpdateInformacaoNutricionalDto,
  ) {
    return await this.repositorio.updateInformacaoNutricional(
      id,
      updateInformacaoNutricionalDto,
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
        'Não foi possível excluir a informação nutricional.',
      );
    }
  }
}
