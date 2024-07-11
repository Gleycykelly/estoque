import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { ApiTags } from '@nestjs/swagger';
import { ObterParcialEstadosDto } from './dto/obter-parcial-estados.dto';

@ApiTags('estados')
@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Get()
  findAll() {
    return this.estadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadosService.findOne(+id);
  }

  @Post('/obter-parcial')
  obterParcial(@Body() obterParcialEstadosDto: ObterParcialEstadosDto) {
    return this.estadosService.obterParcial(obterParcialEstadosDto);
  }
}
