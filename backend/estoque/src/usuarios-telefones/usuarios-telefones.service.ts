import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuariosTelefoneDto } from './dto/create-usuarios-telefone.dto';
import { UpdateUsuariosTelefoneDto } from './dto/update-usuarios-telefone.dto';
import { UsuariosTelefones } from './entities/usuario-telefone.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsuariosTelefonesService {
  @InjectRepository(UsuariosTelefones)
  private readonly usuarioTelefonesRepository: Repository<UsuariosTelefones>;

  async create(createUsuariosTelefoneDto: CreateUsuariosTelefoneDto) {
    const usuarioTelefones = this.usuarioTelefonesRepository.create({
      ...createUsuariosTelefoneDto,
    });

    return this.usuarioTelefonesRepository.save(usuarioTelefones);
  }

  async findAll() {
    return await this.usuarioTelefonesRepository.find();
  }

  async findOne(id: number) {
    return await this.usuarioTelefonesRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    updateUsuariosTelefoneDto: UpdateUsuariosTelefoneDto,
  ) {
    const usuarioTelefones = await this.usuarioTelefonesRepository.preload({
      ...updateUsuariosTelefoneDto,
      id,
    });

    if (!usuarioTelefones) {
      throw new NotFoundException(
        `Nenhuma relação entre usuário e telefones encontrada para o id ${id}`,
      );
    }

    return this.usuarioTelefonesRepository.save(usuarioTelefones);
  }

  async remove(id: number) {
    try {
      const usuario = await this.findOne(id);

      return await this.usuarioTelefonesRepository.remove(usuario);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir os telefones cadastrados para este usuário!.',
      );
    }
  }
}
