import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuariosService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    );

    if (authorization) {
      const data = this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      );

      if (data) {
        request.tokenPayload = data;
        request.user = await this.usuarioService.findOne(data.id);
        return true;
      }
    }

    if (allowUnauthorizedRequest) {
      return true;
    }

    return false;
  }
}
