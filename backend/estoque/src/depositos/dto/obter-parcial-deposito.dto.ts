import { IsString } from 'class-validator';

export class ObterParcialDepositoDto {
  @IsString()
  termo: string;
}
