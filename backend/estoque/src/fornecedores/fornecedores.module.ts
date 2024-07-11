import { Module } from '@nestjs/common';
import { FornecedoresService } from './fornecedores.service';
import { FornecedoresController } from './fornecedores.controller';
import { Fornecedores } from './entities/fornecedor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { EnderecosModule } from 'src/enderecos/enderecos.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Fornecedores, Enderecos]),
    EnderecosModule,
  ],
  controllers: [FornecedoresController],
  providers: [FornecedoresService],
  exports: [FornecedoresService],
})
export class FornecedoresModule {}
