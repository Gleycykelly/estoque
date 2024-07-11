import { Module } from '@nestjs/common';
import { LocalizacoesDepositosService } from './localizacoes-depositos.service';
import { LocalizacoesDepositosController } from './localizacoes-depositos.controller';
import { LocalizacoesDepositos } from './entities/localizacao-deposito.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Depositos } from 'src/depositos/entities/deposito.entity';
import { DepositosModule } from 'src/depositos/depositos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalizacoesDepositos, Depositos]),
    DepositosModule,
  ],
  controllers: [LocalizacoesDepositosController],
  providers: [LocalizacoesDepositosService],
  exports: [LocalizacoesDepositosService],
})
export class LocalizacoesDepositosModule {}
