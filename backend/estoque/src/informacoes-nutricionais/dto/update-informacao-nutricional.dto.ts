import { PartialType } from '@nestjs/swagger';
import { CreateInformacaoNutricionalDto } from './create-informacao-nutricional.dto';

export class UpdateInformacaoNutricionalDto extends PartialType(
  CreateInformacaoNutricionalDto,
) {}
