import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../users/users.entity';
import {Product} from "../products/entities/product.entity";
import {Currency} from "../products/entities/currency.entity";
import {ProductPrice} from "../products/entities/product-price.entity";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'nestdb',
    entities: [User, Product, Currency, ProductPrice],
    migrations: ['src/migrations/*.ts'],  // CLI uses TS, runtime uses JS
    synchronize: false,
});