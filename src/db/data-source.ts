import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../users/users.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'nestdb',
    entities: [User],
    migrations: ['src/migrations/*.ts'],  // CLI uses TS, runtime uses JS
    synchronize: false,
});