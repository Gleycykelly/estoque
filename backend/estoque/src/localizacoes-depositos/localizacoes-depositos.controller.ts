import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocalizacoesDepositosService } from './localizacoes-depositos.service';
import { CreateLocalizacoesDepositoDto } from './dto/create-localizacoes-deposito.dto';
import { UpdateLocalizacoesDepositoDto } from './dto/update-localizacoes-deposito.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('localizacoes-depositos')
@Controller('localizacoes-depositos')
export class LocalizacoesDepositosController {
  constructor(
    private readonly localizacoesDepositosService: LocalizacoesDepositosService,
  ) {}

  @Post()
  create(@Body() createLocalizacoesDepositoDto: CreateLocalizacoesDepositoDto) {
    return this.localizacoesDepositosService.create(
      createLocalizacoesDepositoDto,
    );
  }

  @Get()
  findAll() {
    return this.localizacoesDepositosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localizacoesDepositosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocalizacoesDepositoDto: UpdateLocalizacoesDepositoDto,
  ) {
    return this.localizacoesDepositosService.update(
      +id,
      updateLocalizacoesDepositoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.localizacoesDepositosService.remove(+id);
  }
}
