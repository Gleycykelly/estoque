import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';
import { InformacoesNutricionais } from 'src/informacoes-nutricionais/entities/informacao-nutricional.entity';
import { Produtos } from 'src/produtos/entities/produto.entity';
import { UnidadesMedidas } from 'src/unidades_medidas/entities/unidades_medida.entity';
import { ValoresNutricionais } from 'src/valores-nutricionais/entities/valor-nutricional.entity';

export class CreatePorcoeDto {
  @IsNotEmpty()
  @IsString()
  porcao: string;

  @IsNotEmptyObject()
  produto: Produtos;

  @IsNotEmptyObject()
  unidadeMedida: UnidadesMedidas;

  @IsNotEmptyObject()
  valorNutricional: ValoresNutricionais;

  @IsNotEmptyObject()
  informacaoNutricional: InformacoesNutricionais;
}
