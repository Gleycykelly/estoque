import { PartialType } from '@nestjs/swagger';
import { CreateLocalizacoesDepositoDto } from './create-localizacoes-deposito.dto';

export class UpdateLocalizacoesDepositoDto extends PartialType(
  CreateLocalizacoesDepositoDto,
) {
  id: number;
}
