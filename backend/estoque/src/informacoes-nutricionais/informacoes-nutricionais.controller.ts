import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InformacoesNutricionaisService } from './informacoes-nutricionais.service';
import { CreateInformacaoNutricionalDto } from './dto/create-informacao-nutricional.dto';
import { UpdateInformacaoNutricionalDto } from './dto/update-informacao-nutricional.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('informacoes-nutricionais')
@Controller('informacoes-nutricionais')
export class InformacoesNutricionaisController {
  constructor(
    private readonly informacoesNutricionaisService: InformacoesNutricionaisService,
  ) {}

  @Post()
  create(
    @Body() createInformacoesNutricionaiDto: CreateInformacaoNutricionalDto,
  ) {
    return this.informacoesNutricionaisService.create(
      createInformacoesNutricionaiDto,
    );
  }

  @Get()
  findAll() {
    return this.informacoesNutricionaisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.informacoesNutricionaisService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInformacaoNutricionalDto: UpdateInformacaoNutricionalDto,
  ) {
    return this.informacoesNutricionaisService.update(
      +id,
      updateInformacaoNutricionalDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.informacoesNutricionaisService.remove(+id);
  }
}
