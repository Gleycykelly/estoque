import { PartialType } from '@nestjs/swagger';
import { CreateUsuariosTelefoneDto } from './create-usuarios-telefone.dto';

export class UpdateUsuariosTelefoneDto extends PartialType(
  CreateUsuariosTelefoneDto,
) {}
