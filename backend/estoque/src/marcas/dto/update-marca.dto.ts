import { PartialType } from '@nestjs/swagger';
import { CreateMarcaDto } from './create-marca.dto';
import { IsOptional } from 'class-validator';

export class UpdateMarcaDto extends PartialType(CreateMarcaDto) {
  @IsOptional()
  id: number;
}
