import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LancamentosProdutosService } from './lancamentos-produtos.service';
import { CreateLancamentosProdutoDto } from './dto/create-lancamentos-produto.dto';
import { UpdateLancamentosProdutoDto } from './dto/update-lancamentos-produto.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('lancamentos-produtos')
@Controller('lancamentos-produtos')
export class LancamentosProdutosController {
  constructor(
    private readonly lancamentosProdutosService: LancamentosProdutosService,
  ) {}

  @Post()
  create(@Body() createLancamentosProdutoDto: CreateLancamentosProdutoDto) {
    return this.lancamentosProdutosService.create(createLancamentosProdutoDto);
  }

  @Get()
  findAll() {
    return this.lancamentosProdutosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lancamentosProdutosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLancamentosProdutoDto: UpdateLancamentosProdutoDto,
  ) {
    return this.lancamentosProdutosService.update(
      +id,
      updateLancamentosProdutoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lancamentosProdutosService.remove(+id);
  }
}
