import { PartialType } from '@nestjs/swagger';
import { CreateLancamentosProdutoDto } from './create-lancamentos-produto.dto';

export class UpdateLancamentosProdutoDto extends PartialType(
  CreateLancamentosProdutoDto,
) {}
