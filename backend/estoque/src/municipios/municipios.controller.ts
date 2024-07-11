import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MunicipiosService } from './municipios.service';
import { ApiTags } from '@nestjs/swagger';
import { ObterParcialMunicipiosDto } from './dto/obter-parcial-municipios.dto';

@ApiTags('municipios')
@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Get()
  findAll() {
    return this.municipiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.municipiosService.findOne(+id);
  }

  @Post('/obter-parcial')
  obterParcial(@Body() obterParcialMunicipiosDto: ObterParcialMunicipiosDto) {
    return this.municipiosService.obterParcial(obterParcialMunicipiosDto);
  }
}
