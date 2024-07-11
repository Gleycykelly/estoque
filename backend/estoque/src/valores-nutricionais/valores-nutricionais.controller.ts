import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ValoresNutricionaisService } from './valores-nutricionais.service';
import { CreateValoresNutricionaiDto } from './dto/create-valores-nutricionai.dto';
import { UpdateValoresNutricionaiDto } from './dto/update-valores-nutricionai.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('valores-nutricionais')
@Controller('valores-nutricionais')
export class ValoresNutricionaisController {
  constructor(
    private readonly valoresNutricionaisService: ValoresNutricionaisService,
  ) {}

  @Post()
  create(@Body() createValoresNutricionaiDto: CreateValoresNutricionaiDto) {
    return this.valoresNutricionaisService.create(createValoresNutricionaiDto);
  }

  @Get()
  findAll() {
    return this.valoresNutricionaisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.valoresNutricionaisService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateValoresNutricionaiDto: UpdateValoresNutricionaiDto,
  ) {
    return this.valoresNutricionaisService.update(
      +id,
      updateValoresNutricionaiDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.valoresNutricionaisService.remove(+id);
  }
}
