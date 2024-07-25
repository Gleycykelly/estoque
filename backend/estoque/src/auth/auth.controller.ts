import { Body, Controller, Post, SetMetadata } from '@nestjs/common';
import { AuthEntrarDto } from './dto/auth-entrar.dto';
import { ApiTags } from '@nestjs/swagger';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';

const AllowUnauthorizedRequest = () =>
  SetMetadata('allowUnauthorizedRequest', true);

@ApiTags('autenticacao')
@Controller('autenticacao')
export class AuthController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly authsService: AuthService,
  ) {}

  @AllowUnauthorizedRequest()
  @Post('entrar')
  async entrar(@Body() { email, senha }: AuthEntrarDto) {
    return this.authsService.entrar(email, senha);
  }

  @AllowUnauthorizedRequest()
  @Post('registrar')
  async registrar(@Body() body: CreateUsuarioDto) {
    return await this.usuariosService.create(body);
  }
}
