import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { DepositosService } from './depositos.service';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ObterParcialDepositoDto } from './dto/obter-parcial-deposito.dto';

@ApiTags('depositos')
@ApiBearerAuth()
@Controller('depositos')
export class DepositosController {
  constructor(private readonly depositosService: DepositosService) {}

  @Post()
  create(@Body() createDepositoDto: CreateDepositoDto) {
    return this.depositosService.create(createDepositoDto);
  }

  @Get()
  findAll() {
    return this.depositosService.findAll();
  }

  @Get('obter-quantidade-de-depositos-visiveis')
  obterQuantidadeDeDepositosVisiveis(@Headers('Authorization') token: string) {
    return this.depositosService.obterQuantidadeDeDepositosVisiveis(token);
  }

  @Post('/obter-parcial')
  obterParcial(
    @Body() obterParcialDepositoDto: ObterParcialDepositoDto,
    @Headers('Authorization') token: string,
  ) {
    return this.depositosService.obterParcial(obterParcialDepositoDto, token);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depositosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepositoDto: UpdateDepositoDto,
  ) {
    return this.depositosService.update(+id, updateDepositoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depositosService.remove(+id);
  }
}
