import { Module } from '@nestjs/common';
import { FornecedoresService } from './fornecedores.service';
import { FornecedoresController } from './fornecedores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { EnderecosModule } from 'src/enderecos/enderecos.module';
import { FornecedoresRepository } from './fornecedores.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([FornecedoresRepository, Enderecos]),
    EnderecosModule,
  ],
  controllers: [FornecedoresController],
  providers: [FornecedoresService, FornecedoresRepository],
  exports: [FornecedoresService],
})
export class FornecedoresModule {}
