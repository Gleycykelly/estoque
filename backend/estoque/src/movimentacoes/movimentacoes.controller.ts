import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovimentacoesService } from './movimentacoes.service';
import { CreateMovimentacoeDto } from './dto/create-movimentacoe.dto';
import { UpdateMovimentacoeDto } from './dto/update-movimentacoe.dto';
import { ApiTags } from '@nestjs/swagger';
import { ObterParcialMovimentacaoDto } from './dto/obter-parcial-movimentacao.dto';

@ApiTags('movimentacoes')
@Controller('movimentacoes')
export class MovimentacoesController {
  constructor(private readonly movimentacoesService: MovimentacoesService) {}

  @Post()
  create(
    @Body() createMovimentacoeDto: CreateMovimentacoeDto,
    @Headers('Authorization') token: string,
  ) {
    return this.movimentacoesService.create(createMovimentacoeDto, token);
  }

  @Get()
  findAll() {
    return this.movimentacoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimentacoesService.findOne(+id);
  }

  @Get('obter-movimentacoes-por-lote/:lote')
  obterPorLote(@Param('lote') lote: string) {
    return this.movimentacoesService.obterPorLote(lote);
  }

  @Post('/obter-parcial')
  obterParcial(
    @Body() obterParcialMovimentacaoDto: ObterParcialMovimentacaoDto,
  ) {
    return this.movimentacoesService.obterParcial(obterParcialMovimentacaoDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovimentacoeDto: UpdateMovimentacoeDto,
  ) {
    return this.movimentacoesService.update(+id, updateMovimentacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimentacoesService.remove(+id);
  }
}
