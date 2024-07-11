import { Module } from '@nestjs/common';
import { DepositosService } from './depositos.service';
import { DepositosController } from './depositos.controller';
import { Depositos } from './entities/deposito.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { JwtModule } from '@nestjs/jwt';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import { EnderecosModule } from 'src/enderecos/enderecos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Depositos, Enderecos, Usuarios]),
    JwtModule.register({
      secret: process.env.ENCRYPT_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
    EnderecosModule,
  ],
  controllers: [DepositosController],
  providers: [DepositosService],
  exports: [DepositosService],
})
export class DepositosModule {}
