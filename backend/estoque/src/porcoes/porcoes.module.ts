import { Module } from '@nestjs/common';
import { PorcoesService } from './porcoes.service';
import { PorcoesController } from './porcoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadesMedidas } from 'src/unidades_medidas/entities/unidades_medida.entity';
import { ValoresNutricionais } from 'src/valores-nutricionais/entities/valor-nutricional.entity';
import { InformacoesNutricionais } from 'src/informacoes-nutricionais/entities/informacao-nutricional.entity';
import { ValoresNutricionaisModule } from 'src/valores-nutricionais/valores-nutricionais.module';
import { InformacoesNutricionaisModule } from 'src/informacoes-nutricionais/informacoes-nutricionais.module';
import { UnidadesMedidasModule } from 'src/unidades_medidas/unidades_medidas.module';
import { PorcoesRepository } from './porcoes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PorcoesRepository,
      UnidadesMedidas,
      ValoresNutricionais,
      InformacoesNutricionais,
    ]),
    ValoresNutricionaisModule,
    InformacoesNutricionaisModule,
    UnidadesMedidasModule,
  ],
  controllers: [PorcoesController],
  providers: [PorcoesService, PorcoesRepository],
  exports: [PorcoesService],
})
export class PorcoesModule {}
