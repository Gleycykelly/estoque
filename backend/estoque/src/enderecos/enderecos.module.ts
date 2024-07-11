import { Module } from '@nestjs/common';
import { EnderecosService } from './enderecos.service';
import { EnderecosController } from './enderecos.controller';
import { Enderecos } from './entities/endereco.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipios } from 'src/municipios/entities/municipio.entity';
import { JwtModule } from '@nestjs/jwt';
import { MunicipiosModule } from 'src/municipios/municipios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enderecos, Municipios]),
    JwtModule.register({
      secret: process.env.ENCRYPT_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
    MunicipiosModule,
  ],
  controllers: [EnderecosController],
  providers: [EnderecosService],
  exports: [EnderecosService],
})
export class EnderecosModule {}
