import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UnidadesMedidasService } from './unidades_medidas.service';
import { CreateUnidadesMedidaDto } from './dto/create-unidades_medida.dto';
import { UpdateUnidadesMedidaDto } from './dto/update-unidades_medida.dto';
import { ApiTags } from '@nestjs/swagger';
import { ObterParcialUnidadeMedidaDto } from './dto/obter-parcial-unidade-medida.dto';

@ApiTags('unidades-medidas')
@Controller('unidades-medidas')
export class UnidadesMedidasController {
  constructor(
    private readonly unidadesMedidasService: UnidadesMedidasService,
  ) {}

  @Post()
  create(@Body() createUnidadesMedidaDto: CreateUnidadesMedidaDto) {
    return this.unidadesMedidasService.create(createUnidadesMedidaDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUnidadesMedidaDto: UpdateUnidadesMedidaDto,
  ) {
    return this.unidadesMedidasService.update(+id, updateUnidadesMedidaDto);
  }

  @Get()
  findAll() {
    return this.unidadesMedidasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadesMedidasService.findOne(+id);
  }

  @Post('/obter-parcial')
  obterParcial(
    @Body() obterParcialUnidadeMedidaDto: ObterParcialUnidadeMedidaDto,
  ) {
    return this.unidadesMedidasService.obterParcial(
      obterParcialUnidadeMedidaDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unidadesMedidasService.remove(+id);
  }
}
