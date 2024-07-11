import 'dotenv/config';
import { Categorias } from 'src/categorias/entities/categoria.entity';
import { Depositos } from 'src/depositos/entities/deposito.entity';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { Estados } from 'src/estados/entities/estado.entity';
import { Fornecedores } from 'src/fornecedores/entities/fornecedor.entity';
import { InformacoesNutricionais } from 'src/informacoes-nutricionais/entities/informacao-nutricional.entity';
import { LancamentosProdutos } from 'src/lancamentos-produtos/entities/lancamento-produto.entity';
import { LocalizacoesDepositos } from 'src/localizacoes-depositos/entities/localizacao-deposito.entity';
import { Marcas } from 'src/marcas/entities/marca.entity';
import { Movimentacoes } from 'src/movimentacoes/entities/movimentacao.entity';
import { Municipios } from 'src/municipios/entities/municipio.entity';
import { Porcoes } from 'src/porcoes/entities/porcao.entity';
import { Produtos } from 'src/produtos/entities/produto.entity';
import { UnidadesMedidas } from 'src/unidades_medidas/entities/unidades_medida.entity';
import { UsuariosTelefones } from 'src/usuarios-telefones/entities/usuario-telefone.entity';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import { ValoresNutricionais } from 'src/valores-nutricionais/entities/valor-nutricional.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_USER ||
  !process.env.DB_PASS ||
  !process.env.DB_NAME
) {
  throw new Error(
    'Algumas variáveis de ambiente não foram definidas para a configuração do banco de dados.',
  );
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [],
});
