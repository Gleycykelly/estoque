import { Module } from '@nestjs/common';
import { MunicipiosService } from './municipios.service';
import { MunicipiosController } from './municipios.controller';
import { Estados } from 'src/estados/entities/estado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipiosRepository } from './municipios.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MunicipiosRepository, Estados])],
  controllers: [MunicipiosController],
  providers: [MunicipiosService, MunicipiosRepository],
  exports: [MunicipiosService],
})
export class MunicipiosModule {}
