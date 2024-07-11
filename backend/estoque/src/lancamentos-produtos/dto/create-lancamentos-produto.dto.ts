import {
  IsDecimal,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
} from 'class-validator';
import { CreateFornecedoreDto } from 'src/fornecedores/dto/create-fornecedor.dto';
import { LocalizacoesDepositos } from 'src/localizacoes-depositos/entities/localizacao-deposito.entity';
import { Produtos } from 'src/produtos/entities/produto.entity';
export class CreateLancamentosProdutoDto {
  @IsNotEmpty()
  dataValidade: Date;

  @IsString()
  @IsNotEmpty()
  lote: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  precoCusto: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  precoVenda: number;

  @IsNotEmptyObject()
  produto: Produtos;

  @IsNotEmptyObject()
  fornecedor: CreateFornecedoreDto;

  @IsNotEmptyObject()
  localizacaoDeposito: LocalizacoesDepositos;
}
