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

  private async verificaValoresDuplicados(createUsuariosTelefoneDto: any) {
    const usuarioJaExiste = await this.usuarioTelefonesRepository.findOne({
      where: [{ usuario: createUsuariosTelefoneDto.usuario.id }],
    });

    if (usuarioJaExiste) {
      throw new ConflictException(`Usuário já possui telefones cadastrado!`);
    }
  }

  async create(createUsuariosTelefoneDto: CreateUsuariosTelefoneDto) {
    await this.verificaValoresDuplicados(createUsuariosTelefoneDto);

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
    const usuarioTelefones = await this.usuarioTelefonesRepository.findOne({
      where: { id },
    });

    if (!usuarioTelefones) {
      throw new NotFoundException(
        `Nenhuma relação entre usuário e telefones encontrada para o id ${id}`,
      );
    }

    return this.usuarioTelefonesRepository.remove(usuarioTelefones);
  }
}
