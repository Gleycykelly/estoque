import { Module } from '@nestjs/common';
import { EnderecosService } from './enderecos.service';
import { EnderecosController } from './enderecos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipios } from 'src/municipios/entities/municipio.entity';
import { JwtModule } from '@nestjs/jwt';
import { MunicipiosModule } from 'src/municipios/municipios.module';
import { EnderecosRepository } from './enderecos.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnderecosRepository, Municipios]),
    JwtModule.register({
      secret: process.env.ENCRYPT_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
    MunicipiosModule,
  ],
  controllers: [EnderecosController],
  providers: [EnderecosService, EnderecosRepository],
  exports: [EnderecosService],
})
export class EnderecosModule {}
