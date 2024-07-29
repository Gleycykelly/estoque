import {
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { LancamentosProdutos } from 'src/lancamentos-produtos/entities/lancamento-produto.entity';
import { TipoMovimentacao } from '../enum/tipo-movimentacao.enum';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';

export class CreateMovimentacoeDto {
  @IsOptional()
  dataMovimentacao: Date;

  @IsNumber(
    {},
    {
      message: 'Preencha o campo de quantidade apenas com valores númericos',
    },
  )
  quantidade: number;

  @IsEnum(TipoMovimentacao)
  tipoMovimentacao: TipoMovimentacao;

  @IsNotEmptyObject()
  lancamentoProduto: LancamentosProdutos;

  @IsOptional()
  usuario: Usuarios;
}
