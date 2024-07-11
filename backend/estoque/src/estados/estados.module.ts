import { Module } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { EstadosController } from './estados.controller';
import { Estados } from './entities/estado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Estados])],
  controllers: [EstadosController],
  providers: [EstadosService],
})
export class EstadosModule {}
