import { DataSource } from 'typeorm';
import { databaseConfig } from './config/database.config';
import * as path from 'path';

const AppDataSource = new DataSource({
    type: databaseConfig.type as any,
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    entities: [path.join(__dirname, '/**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '/migrations/*-*.ts'), path.join(__dirname, '/migrations/*-*.js')],
    migrationsTableName: undefined,
    synchronize: false,
});

export default AppDataSource;
