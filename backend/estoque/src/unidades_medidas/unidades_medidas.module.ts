import { Module } from '@nestjs/common';
import { UnidadesMedidasService } from './unidades_medidas.service';
import { UnidadesMedidasController } from './unidades_medidas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadesMedidasRepository } from './unidades_medidas.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadesMedidasRepository])],
  controllers: [UnidadesMedidasController],
  providers: [UnidadesMedidasService, UnidadesMedidasRepository],
  exports: [UnidadesMedidasService],
})
export class UnidadesMedidasModule {}
