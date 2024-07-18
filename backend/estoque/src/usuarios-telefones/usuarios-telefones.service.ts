import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUsuariosTelefoneDto } from './dto/create-usuarios-telefone.dto';
import { UpdateUsuariosTelefoneDto } from './dto/update-usuarios-telefone.dto';
import { UsuariosTelefonesRepository } from './usuarios-telefones.repository';

@Injectable()
export class UsuariosTelefonesService {
  constructor(private readonly repositorio: UsuariosTelefonesRepository) {}

  async create(createUsuariosTelefoneDto: CreateUsuariosTelefoneDto) {
    return await this.repositorio.createUsuariosTelefones(
      createUsuariosTelefoneDto,
    );
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async update(
    id: number,
    updateUsuariosTelefoneDto: UpdateUsuariosTelefoneDto,
  ) {
    return await this.repositorio.updateUsuarioTelefones(
      id,
      updateUsuariosTelefoneDto,
    );
  }

  async remove(id: number) {
    try {
      return await this.repositorio.excluir(id);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir os telefones cadastrados para este usuário!.',
      );
    }
  }
}
