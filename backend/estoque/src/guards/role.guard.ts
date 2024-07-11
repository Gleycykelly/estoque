import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const regrasNoMetodoAtual = this.reflector.getAllAndOverride<Role[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!regrasNoMetodoAtual) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const regras = regrasNoMetodoAtual.filter(
      (role) => role == user.permissaoUsuario,
    );

    return regras.length > 0;
  }
}
