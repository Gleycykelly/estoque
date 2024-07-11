import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FornecedoresService } from './fornecedores.service';
import { CreateFornecedoreDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedoreDto } from './dto/update-fornecedor.dto';
import { ApiTags } from '@nestjs/swagger';
import { ObterParcialFornecedorDto } from './dto/obter-parcial-fornecedores.dto';

@ApiTags('fornecedores')
@Controller('fornecedores')
export class FornecedoresController {
  constructor(private readonly fornecedoresService: FornecedoresService) {}

  @Post()
  create(@Body() createFornecedoreDto: CreateFornecedoreDto) {
    return this.fornecedoresService.create(createFornecedoreDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFornecedoreDto: UpdateFornecedoreDto,
  ) {
    return this.fornecedoresService.update(+id, updateFornecedoreDto);
  }

  @Get()
  findAll() {
    return this.fornecedoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fornecedoresService.findOne(+id);
  }

  @Post('/obter-parcial')
  obterParcial(@Body() obterParcialFornecedorDto: ObterParcialFornecedorDto) {
    return this.fornecedoresService.obterParcial(obterParcialFornecedorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fornecedoresService.remove(+id);
  }
}
