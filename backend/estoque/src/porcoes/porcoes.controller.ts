import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PorcoesService } from './porcoes.service';
import { CreatePorcoeDto } from './dto/create-porcoe.dto';
import { UpdatePorcoeDto } from './dto/update-porcoe.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('porcoes')
@Controller('porcoes')
export class PorcoesController {
  constructor(private readonly porcoesService: PorcoesService) {}

  @Post()
  create(@Body() createPorcoeDto: CreatePorcoeDto) {
    return this.porcoesService.create(createPorcoeDto);
  }

  @Get()
  findAll() {
    return this.porcoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.porcoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePorcoeDto: UpdatePorcoeDto) {
    return this.porcoesService.update(+id, updatePorcoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.porcoesService.remove(+id);
  }
}
