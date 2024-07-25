import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { ObterParcialUsuarioDto } from './dto/obter-parcial-usuario.dto';

const AllowUnauthorizedRequest = () =>
  SetMetadata('allowUnauthorizedRequest', true);

@UseGuards(AuthGuard, RoleGuard)
@ApiTags('usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @Roles(Role.Administrador)
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Post('/obter-parcial')
  obterParcial(@Body() obterParcialUsuarioDto: ObterParcialUsuarioDto) {
    return this.usuariosService.obterParcial(obterParcialUsuarioDto);
  }

  @Post('/obter-usuario-logado')
  obterUsuarioLogado(@Headers('Authorization') token: string) {
    return this.usuariosService.obterUsuarioLogado(token);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
