import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Categorias } from 'src/categorias/entities/categoria.entity';
import { Depositos } from 'src/depositos/entities/deposito.entity';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { Estados } from 'src/estados/entities/estado.entity';
import { Fornecedores } from 'src/fornecedores/entities/fornecedor.entity';
import { LocalizacoesDepositos } from 'src/localizacoes-depositos/entities/localizacao-deposito.entity';
import { Marcas } from 'src/marcas/entities/marca.entity';
import { Municipios } from 'src/municipios/entities/municipio.entity';
import { Porcoes } from 'src/porcoes/entities/porcao.entity';
import { Produtos } from 'src/produtos/entities/produto.entity';
import { UnidadesMedidas } from 'src/unidades_medidas/entities/unidades_medida.entity';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import { ValoresNutricionais } from 'src/valores-nutricionais/entities/valor-nutricional.entity';
import { InformacoesNutricionais } from 'src/informacoes-nutricionais/entities/informacao-nutricional.entity';
import { LancamentosProdutos } from 'src/lancamentos-produtos/entities/lancamento-produto.entity';
import { Movimentacoes } from 'src/movimentacoes/entities/movimentacao.entity';
import { UsuariosTelefones } from 'src/usuarios-telefones/entities/usuario-telefone.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PORT')),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASS'),
          database: configService.get('DB_NAME'),
          entities: [
            Categorias,
            Depositos,
            Enderecos,
            Estados,
            Fornecedores,
            InformacoesNutricionais,
            LancamentosProdutos,
            LocalizacoesDepositos,
            Marcas,
            Movimentacoes,
            Municipios,
            Porcoes,
            Produtos,
            UnidadesMedidas,
            Usuarios,
            UsuariosTelefones,
            ValoresNutricionais,
          ],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
