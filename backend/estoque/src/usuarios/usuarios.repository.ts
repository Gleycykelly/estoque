import { Injectable, NotFoundException } from '@nestjs/common';
import { Usuarios } from './entities/usuario.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ObterParcialUsuarioDto } from './dto/obter-parcial-usuario.dto';

@Injectable()
export class UsuariosRepository extends Repository<Usuarios> {
  constructor(private dataSource: DataSource) {
    super(Usuarios, dataSource.createEntityManager());
  }

  async createUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuarios> {
    const usuario = this.create({
      ...createUsuarioDto,
    });

    return await this.save(usuario);
  }

  async updateUsuario(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuarios> {
    const usuario = await this.preload({
      ...updateUsuarioDto,
      id,
    });

    if (!usuario) {
      throw new NotFoundException(
        `Nenhum usuário encontrado para o email ${updateUsuarioDto.email}`,
      );
    }

    return await this.save(usuario);
  }

  async obterTodos(): Promise<Usuarios[]> {
    return await this.find({
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
  }

  async obterPorId(id: number): Promise<Usuarios> {
    return await this.findOne({
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
  }

  async obterParcial(
    obterParcialUsuarioDto: ObterParcialUsuarioDto,
  ): Promise<Usuarios[]> {
    let query = await this.createQueryBuilder('usuario');

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

  async existeUsuario(email: string) {
    return await this.count({
      where: { email },
    });
  }

  async obterUsuarioPorEmail(email: string): Promise<Usuarios> {
    return await this.findOne({
      where: { email },
    });
  }

  async obterUsuarioLogado(id: number): Promise<Usuarios> {
    return await this.findOne({
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
  }

  async excluir(id: number) {
    const usuario = await this.obterPorId(id);
    return await this.remove(usuario);
  }
}
