import { Module, forwardRef } from '@nestjs/common';
import { PorcoesService } from './porcoes.service';
import { PorcoesController } from './porcoes.controller';
import { Porcoes } from './entities/porcao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produtos } from 'src/produtos/entities/produto.entity';
import { UnidadesMedidas } from 'src/unidades_medidas/entities/unidades_medida.entity';
import { ValoresNutricionais } from 'src/valores-nutricionais/entities/valor-nutricional.entity';
import { InformacoesNutricionais } from 'src/informacoes-nutricionais/entities/informacao-nutricional.entity';
import { ValoresNutricionaisModule } from 'src/valores-nutricionais/valores-nutricionais.module';
import { InformacoesNutricionaisModule } from 'src/informacoes-nutricionais/informacoes-nutricionais.module';
import { UnidadesMedidasModule } from 'src/unidades_medidas/unidades_medidas.module';
import { ProdutosModule } from 'src/produtos/produtos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Porcoes,
      Produtos,
      UnidadesMedidas,
      ValoresNutricionais,
      InformacoesNutricionais,
    ]),
    ValoresNutricionaisModule,
    InformacoesNutricionaisModule,
    UnidadesMedidasModule,
    forwardRef(() => ProdutosModule),
  ],
  controllers: [PorcoesController],
  providers: [PorcoesService],
  exports: [PorcoesService],
})
export class PorcoesModule {}
