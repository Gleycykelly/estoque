import { PartialType } from '@nestjs/swagger';
import { CreateUnidadesMedidaDto } from './create-unidades_medida.dto';

export class UpdateUnidadesMedidaDto extends PartialType(
  CreateUnidadesMedidaDto,
) {}
