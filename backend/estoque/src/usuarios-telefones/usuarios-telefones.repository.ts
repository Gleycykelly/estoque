import { DataSource, Repository } from 'typeorm';
import { UsuariosTelefones } from './entities/usuario-telefone.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuariosTelefoneDto } from './dto/create-usuarios-telefone.dto';
import { UpdateUsuariosTelefoneDto } from './dto/update-usuarios-telefone.dto';

@Injectable()
export class UsuariosTelefonesRepository extends Repository<UsuariosTelefones> {
  constructor(private dataSource: DataSource) {
    super(UsuariosTelefones, dataSource.createEntityManager());
  }

  async createUsuariosTelefones(
    createUsuariosTelefoneDto: CreateUsuariosTelefoneDto,
  ): Promise<UsuariosTelefones> {
    const usuarioTelefones = this.create({
      ...createUsuariosTelefoneDto,
    });

    return await this.save(usuarioTelefones);
  }

  async updateUsuarioTelefones(
    id: number,
    updateUsuariosTelefoneDto: UpdateUsuariosTelefoneDto,
  ): Promise<UsuariosTelefones> {
    const usuarioTelefones = await this.preload({
      ...updateUsuariosTelefoneDto,
      id,
    });

    if (!usuarioTelefones) {
      throw new NotFoundException(
        `Nenhuma relação entre usuário e telefones encontrada para o id ${id}`,
      );
    }

    return await this.save(usuarioTelefones);
  }

  async obterTodos(): Promise<UsuariosTelefones[]> {
    return await this.find();
  }

  async obterPorId(id: number): Promise<UsuariosTelefones> {
    return await this.findOne({
      where: { id },
    });
  }

  async excluir(id: number) {
    const usuario = await this.obterPorId(id);

    return await this.remove(usuario);
  }
}
