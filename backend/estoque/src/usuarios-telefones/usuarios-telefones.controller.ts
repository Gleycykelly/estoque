import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsuariosTelefonesService } from './usuarios-telefones.service';
import { CreateUsuariosTelefoneDto } from './dto/create-usuarios-telefone.dto';
import { UpdateUsuariosTelefoneDto } from './dto/update-usuarios-telefone.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('usuarios-telefones')
@Controller('usuarios-telefones')
export class UsuariosTelefonesController {
  constructor(
    private readonly usuariosTelefonesService: UsuariosTelefonesService,
  ) {}

  @Post()
  create(@Body() createUsuariosTelefoneDto: CreateUsuariosTelefoneDto) {
    return this.usuariosTelefonesService.create(createUsuariosTelefoneDto);
  }

  @Get()
  findAll() {
    return this.usuariosTelefonesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosTelefonesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsuariosTelefoneDto: UpdateUsuariosTelefoneDto,
  ) {
    return this.usuariosTelefonesService.update(+id, updateUsuariosTelefoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosTelefonesService.remove(+id);
  }
}
