import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuariosService: UsuariosService,
  ) {}

  createToken(usuario: any) {
    return this.jwtService.sign({ id: usuario.id });
  }

  checkToken(token: string) {
    try {
      return this.jwtService.verify(token.replace('Bearer ', ''));
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async entrar(email: string, senha: string) {
    const usuario = await this.usuariosService.obterUsuarioPorEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('E-mail ou/e senha incorreta!');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou/e senha incorreta!');
    }

    return this.createToken(usuario);
  }

  // async sair(req: Request) {
  //   localStorage.clear();

  //   // return this.createToken(usuario);
  // }

  async esqueceuASenha(email: string) {
    const usuario = await this.usuariosService.obterUsuarioPorEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('E-mail não cadastrado!');
    }

    return true;
  }

  // async redefinirSenha(senha: string, token: string) {
  //   const userIdToken = this.checkToken(token);
  //   if (!userIdToken) {
  //     throw new UnauthorizedException(
  //       'Você não possui autorização para alterar a senha!',
  //     );
  //   }
  //   const id = userIdToken.id;
  //   const dados = {
  //     id: id,
  //     senha: senha,
  //   };
  //   const novoUsuario = this.usuariosService.update(dados);

  //   return this.createToken(novoUsuario);
  // }

  async registrar(createUsuarioDto: CreateUsuarioDto) {
    const novoUsuario = this.usuariosService.create(createUsuarioDto);

    return this.createToken(novoUsuario);
  }
}
