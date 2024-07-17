import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuarios } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { EnderecosService } from 'src/enderecos/enderecos.service';
import { DepositosService } from 'src/depositos/depositos.service';
import { UsuariosTelefonesService } from 'src/usuarios-telefones/usuarios-telefones.service';
import { ObterParcialUsuarioDto } from './dto/obter-parcial-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly enderecoService: EnderecosService,
    private readonly depositoService: DepositosService,
    private readonly usuariosTelefonesService: UsuariosTelefonesService,
  ) {}

  @InjectRepository(Usuarios)
  private readonly usuarioRepository: Repository<Usuarios>;

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

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
    });

    const usuarioRegistrado = await this.usuarioRepository.save(usuario);
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

    if (jaExiste) {
      const usuAtual = await this.usuarioRepository.findOne({
        where: { email: updateUsuarioDto.email },
      });

      if (usuAtual.id != id) {
        throw new ConflictException(
          `O e-mail ${updateUsuarioDto.email} já está cadastrado!`,
        );
      }
    }

    if (updateUsuarioDto.senha) {
      const usuarioBD = await this.usuarioRepository.findOne({
        where: { email: updateUsuarioDto.email },
      });

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

    const usuario = await this.usuarioRepository.preload({
      ...updateUsuarioDto,
      id,
    });

    if (!usuario) {
      throw new NotFoundException(
        `Nenhum usuário encontrado para o email ${updateUsuarioDto.email}`,
      );
    }

    const usuarioAlterado = await this.usuarioRepository.save(usuario);
    delete usuarioAlterado.senha;

    if (updateUsuarioDto.usuariosTelefones) {
      updateUsuarioDto.usuariosTelefones.usuario = usuario;
      updateUsuarioDto.usuariosTelefones = await this.obtemEntidadeEstrangeira(
        updateUsuarioDto.usuariosTelefones,
        this.usuariosTelefonesService,
      );
    }

    return usuarioAlterado;
  }

  async findAll() {
    const usuarios = await this.usuarioRepository.find({
      relations: [
        'enderecos',
        'enderecos.municipio',
        'enderecos.municipio.uf',
        'usuariosTelefones',
        'depositos',
        'depositos.endereco',
        'depositos.endereco.municipio',
        'depositos.endereco.municipio.uf',
      ],
    });
    usuarios.forEach((usuario) => {
      delete usuario.senha;
    });
    return usuarios;
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      relations: [
        'enderecos',
        'enderecos.municipio',
        'enderecos.municipio.uf',
        'usuariosTelefones',
        'depositos',
        'depositos.endereco',
        'depositos.endereco.municipio',
        'depositos.endereco.municipio.uf',
      ],
      where: { id },
    });
    if (usuario) {
      delete usuario.senha;
    }
    return usuario;
  }

  async obterParcial(
    obterParcialUsuarioDto: ObterParcialUsuarioDto,
  ): Promise<Usuarios[]> {
    let query = await this.usuarioRepository.createQueryBuilder('usuario');

    if (obterParcialUsuarioDto.termoDePesquisa) {
      query = query
        .where('LOWER(usuario.cpf) LIKE LOWER(:termo)', {
          termo: `%${obterParcialUsuarioDto.termoDePesquisa}%`,
        })
        .orWhere('LOWER(usuario.rg) LIKE LOWER(:termo)', {
          termo: `%${obterParcialUsuarioDto.termoDePesquisa}%`,
        })
        .orWhere('LOWER(usuario.nome) LIKE LOWER(:termo)', {
          termo: `%${obterParcialUsuarioDto.termoDePesquisa}%`,
        })
        .orWhere('LOWER(usuario.email) LIKE LOWER(:termo)', {
          termo: `%${obterParcialUsuarioDto.termoDePesquisa}%`,
        });
    }

    if (obterParcialUsuarioDto.generoUsuario) {
      query = query.andWhere(' usuario.generoUsuario = :generoUsuario', {
        generoUsuario: obterParcialUsuarioDto.generoUsuario,
      });
    }

    if (obterParcialUsuarioDto.permissaoUsuario) {
      query = query.andWhere(' usuario.permissao = :permissaoUsuario', {
        permissaoUsuario: obterParcialUsuarioDto.permissaoUsuario,
      });
    }

    query.orderBy('usuario.id', 'ASC');
    const result = await query.getMany();
    return result;
  }

  async remove(id: number) {
    try {
      const usuario = await this.findOne(id);

      return await this.usuarioRepository.remove(usuario);
    } catch (error) {
      throw new ConflictException('Não foi possível excluir o usuário.');
    }
  }

  async findUsuarioByEmail(email: string) {
    return await this.usuarioRepository.findOne({
      relations: [
        'enderecos',
        'enderecos.municipio',
        'enderecos.municipio.uf',
        'usuariosTelefones',
        'depositos',
        'depositos.endereco',
        'depositos.endereco.municipio',
        'depositos.endereco.municipio.uf',
      ],
      where: { email },
    });
  }

  async obterUsuarioLogado(token: string) {
    const decodedToken = await this.authService.checkToken(token);

    const usuario = await this.usuarioRepository.findOne({
      relations: [
        'enderecos',
        'enderecos.municipio',
        'enderecos.municipio.uf',
        'usuariosTelefones',
        'depositos',
        'depositos.endereco',
        'depositos.endereco.municipio',
        'depositos.endereco.municipio.uf',
      ],
      where: { id: decodedToken.id },
    });
    if (usuario) {
      delete usuario.senha;
    }
    return usuario;
  }

  async usuarioJaCadastrado(email: string, ehAtualizacao = false) {
    const jaExiste = await this.usuarioRepository.count({
      where: { email: email },
    });

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
