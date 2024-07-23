import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuarios } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { EnderecosService } from 'src/enderecos/enderecos.service';
import { DepositosService } from 'src/depositos/depositos.service';
import { UsuariosTelefonesService } from 'src/usuarios-telefones/usuarios-telefones.service';
import { ObterParcialUsuarioDto } from './dto/obter-parcial-usuario.dto';
import { UsuariosRepository } from './usuarios.repository';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @Inject(forwardRef(() => DepositosService))
    private readonly depositoService: DepositosService,

    private readonly repositorio: UsuariosRepository,
    private readonly enderecoService: EnderecosService,
    private readonly usuariosTelefonesService: UsuariosTelefonesService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuarios> {
    createUsuarioDto.senha = createUsuarioDto.cpf.replace(/\D/g, '');

    await this.usuarioJaCadastrado(createUsuarioDto.email);

    const salt = await bcrypt.genSalt();

    createUsuarioDto.senha = await bcrypt.hash(createUsuarioDto.senha, salt);

    if (createUsuarioDto.enderecos && createUsuarioDto.enderecos.length > 0) {
      const enderecos = createUsuarioDto.enderecos;

      createUsuarioDto.enderecos = [];

      for (const endereco of enderecos) {
        createUsuarioDto.enderecos.push(
          await this.obtemEntidadeEstrangeira(endereco, this.enderecoService),
        );
      }
    }

    if (createUsuarioDto.depositos && createUsuarioDto.depositos.length > 0) {
      const depositos = createUsuarioDto.depositos;

      createUsuarioDto.depositos = [];

      for (const deposito of depositos) {
        createUsuarioDto.depositos.push(
          await this.obtemEntidadeEstrangeira(deposito, this.depositoService),
        );
      }
    }

    const usuarioRegistrado =
      await this.repositorio.createUsuario(createUsuarioDto);
    delete usuarioRegistrado.senha;

    if (createUsuarioDto.usuariosTelefones) {
      createUsuarioDto.usuariosTelefones.usuario = usuarioRegistrado;
      createUsuarioDto.usuariosTelefones = await this.obtemEntidadeEstrangeira(
        createUsuarioDto.usuariosTelefones,
        this.usuariosTelefonesService,
      );
    }

    return usuarioRegistrado;
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuarios> {
    const jaExiste = await this.usuarioJaCadastrado(
      updateUsuarioDto.email,
      true,
    );

    const usuarioBD = await this.repositorio.obterUsuarioPorEmail(
      updateUsuarioDto.email,
    );

    if (jaExiste) {
      if (usuarioBD.id != id) {
        throw new ConflictException(
          `O e-mail ${updateUsuarioDto.email} já está cadastrado!`,
        );
      }
    }

    if (updateUsuarioDto.senha) {
      const senhaValida = await bcrypt.compare(
        updateUsuarioDto.senha,
        usuarioBD.senha,
      );

      if (!senhaValida) {
        throw new UnauthorizedException(
          'Senha incorreta, não foi possível atualizar seus dados cadastrais!',
        );
      }

      const novaSenhaIgualAtual = await bcrypt.compare(
        updateUsuarioDto.novaSenha,
        usuarioBD.senha,
      );

      if (novaSenhaIgualAtual) {
        throw new UnauthorizedException(
          'Você não pode definir a nova senha igual a senha atual!',
        );
      }

      const salt = await bcrypt.genSalt();

      if (updateUsuarioDto.novaSenha) {
        updateUsuarioDto.senha = await bcrypt.hash(
          updateUsuarioDto.novaSenha,
          salt,
        );
      }
    }

    if (updateUsuarioDto.enderecos && updateUsuarioDto.enderecos.length > 0) {
      const enderecos = updateUsuarioDto.enderecos;

      updateUsuarioDto.enderecos = [];

      for (const endereco of enderecos) {
        updateUsuarioDto.enderecos.push(
          await this.obtemEntidadeEstrangeira(endereco, this.enderecoService),
        );
      }
    }

    if (updateUsuarioDto.depositos && updateUsuarioDto.depositos.length > 0) {
      const depositos = updateUsuarioDto.depositos;

      updateUsuarioDto.depositos = [];

      for (const deposito of depositos) {
        updateUsuarioDto.depositos.push(
          await this.obtemEntidadeEstrangeira(deposito, this.depositoService),
        );
      }
    }

    const usuarioAlterado = await this.repositorio.updateUsuario(
      id,
      updateUsuarioDto,
    );
    delete usuarioAlterado.senha;

    if (updateUsuarioDto.usuariosTelefones) {
      updateUsuarioDto.usuariosTelefones.usuario = usuarioAlterado;
      updateUsuarioDto.usuariosTelefones = await this.obtemEntidadeEstrangeira(
        updateUsuarioDto.usuariosTelefones,
        this.usuariosTelefonesService,
      );
    }

    return usuarioAlterado;
  }

  async findAll() {
    const usuarios = await this.repositorio.obterTodos();
    usuarios.forEach((usuario) => {
      delete usuario.senha;
    });
    return usuarios;
  }

  async findOne(id: number) {
    const usuario = await this.repositorio.obterPorId(id);
    if (usuario) {
      delete usuario.senha;
    }
    return usuario;
  }

  async obterParcial(
    obterParcialUsuarioDto: ObterParcialUsuarioDto,
  ): Promise<Usuarios[]> {
    return await this.repositorio.obterParcial(obterParcialUsuarioDto);
  }

  async remove(id: number) {
    try {
      return await this.repositorio.excluir(id);
    } catch (error) {
      console.log(error);
      throw new ConflictException('Não foi possível excluir o usuário.');
    }
  }

  async obterUsuarioPorEmail(email: string) {
    return await this.repositorio.obterUsuarioPorEmail(email);
  }

  async obterUsuarioLogado(token: string) {
    const decodedToken = await this.authService.checkToken(token);

    const usuario = await this.repositorio.obterUsuarioLogado(decodedToken.id);
    if (usuario) {
      delete usuario.senha;
    }
    return usuario;
  }

  async usuarioJaCadastrado(email: string, ehAtualizacao = false) {
    const jaExiste = await this.repositorio.existeUsuario(email);

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(`O e-mail ${email} já está cadastrado!`);
    } else if (jaExiste) {
      return true;
    }

    return false;
  }

  private async obtemEntidadeEstrangeira(entidade: any, service: any) {
    if (entidade.id) {
      const entidadeBD = await service.findOne(entidade.id);

      await service.update(entidadeBD.id, entidade);
      return entidadeBD;
    }

    return service.create({ ...entidade });
  }
}
