import { PartialType } from '@nestjs/swagger';
import { CreateDepositoDto } from './create-deposito.dto';

export class UpdateDepositoDto extends PartialType(CreateDepositoDto) {
  id: number;
}
