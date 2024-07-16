import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Module,
  forwardRef,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CategoriasModule } from './categorias/categorias.module';
import { UnidadesMedidasModule } from './unidades_medidas/unidades_medidas.module';
import { EnderecosModule } from './enderecos/enderecos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MarcasModule } from './marcas/marcas.module';
import { FornecedoresModule } from './fornecedores/fornecedores.module';
import { ProdutosModule } from './produtos/produtos.module';
import { DepositosModule } from './depositos/depositos.module';
import { MovimentacoesModule } from './movimentacoes/movimentacoes.module';
import { EstadosModule } from './estados/estados.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { LocalizacoesDepositosModule } from './localizacoes-depositos/localizacoes-depositos.module';
import { UsuariosTelefonesModule } from './usuarios-telefones/usuarios-telefones.module';
import { ValoresNutricionaisModule } from './valores-nutricionais/valores-nutricionais.module';
import { LancamentosProdutosModule } from './lancamentos-produtos/lancamentos-produtos.module';
import { PorcoesModule } from './porcoes/porcoes.module';
import { InformacoesNutricionaisModule } from './informacoes-nutricionais/informacoes-nutricionais.module';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { ExcelModule } from './emissoes/excel/excel.module';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const status = exception.getStatus ? exception.getStatus() : 500;
    let message = exception.message || 'Erro interno do servidor';

    if (exception.code === '23505') {
      message = `${exception.detail}`;
    }
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.ENCRYPT_JWT_SECRET,
      signOptions: {
        expiresIn: parseInt(process.env.EXPIRES),
      },
    }),
    forwardRef(() => AuthModule),
    DatabaseModule,
    CategoriasModule,
    UnidadesMedidasModule,
    EnderecosModule,
    forwardRef(() => UsuariosModule),
    MarcasModule,
    FornecedoresModule,
    ProdutosModule,
    DepositosModule,
    MovimentacoesModule,
    EstadosModule,
    MunicipiosModule,
    LocalizacoesDepositosModule,
    UsuariosTelefonesModule,
    ValoresNutricionaisModule,
    LancamentosProdutosModule,
    PorcoesModule,
    InformacoesNutricionaisModule,
    ExcelModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AppService,
    AuthService,
  ],
})
export class AppModule {}
