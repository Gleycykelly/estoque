import { Module } from '@nestjs/common';
import { UnidadesMedidasService } from './unidades_medidas.service';
import { UnidadesMedidasController } from './unidades_medidas.controller';
import { UnidadesMedidas } from './entities/unidades_medida.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadesMedidas])],
  controllers: [UnidadesMedidasController],
  providers: [UnidadesMedidasService],
  exports: [UnidadesMedidasService],
})
export class UnidadesMedidasModule {}
