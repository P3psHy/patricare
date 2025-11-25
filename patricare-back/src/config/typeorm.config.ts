import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';

export default new DataSource({
  type: databaseConfig.type as any,
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities: [__dirname + '/modules/**/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/**/*.{ts,js}'],
});
