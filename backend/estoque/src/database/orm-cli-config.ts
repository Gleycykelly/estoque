import 'dotenv/config';
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
  entities: ['src/**/*.entity.{ts,js}'],
  synchronize: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [],
});
