import { Module } from '@nestjs/common';
import { LocalizacoesDepositosService } from './localizacoes-depositos.service';
import { LocalizacoesDepositosController } from './localizacoes-depositos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Depositos } from 'src/depositos/entities/deposito.entity';
import { DepositosModule } from 'src/depositos/depositos.module';
import { LocalizacoesDepositosRepository } from './localizacoes-depositos.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalizacoesDepositosRepository, Depositos]),
    DepositosModule,
  ],
  controllers: [LocalizacoesDepositosController],
  providers: [LocalizacoesDepositosService, LocalizacoesDepositosRepository],
  exports: [LocalizacoesDepositosService],
})
export class LocalizacoesDepositosModule {}
