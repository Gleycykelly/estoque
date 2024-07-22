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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ObterParcialMovimentacaoDto } from './dto/obter-parcial-movimentacao.dto';

@ApiTags('movimentacoes')
@ApiBearerAuth()
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

  @Get('valor-total-entradas-saidas')
  valorTotalEntradasSaidas(@Headers('Authorization') token: string) {
    return this.movimentacoesService.valorTotalEntradasSaidas(token);
  }

  @Get('produtos-proximo-vencimento')
  produtosProximosDoVencimento(@Headers('Authorization') token: string) {
    return this.movimentacoesService.produtosProximosDoVencimento(token);
  }

  @Get('produtos-por-estoque')
  quantidadeProdutosPorEstoque(@Headers('Authorization') token: string) {
    return this.movimentacoesService.quantidadeProdutosPorEstoque(token);
  }

  @Get('ultimas-movimentacoes')
  ultimasMovimentacoes() {
    return this.movimentacoesService.ultimasMovimentacoes();
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
    @Headers('Authorization') token: string,
  ) {
    return this.movimentacoesService.obterParcial(
      obterParcialMovimentacaoDto,
      token,
    );
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
