import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../users/users.entity';
import {Product} from "../products/entities/product.entity";
import {Currency} from "../products/entities/currency.entity";
import {ProductPrice} from "../products/entities/product-price.entity";
import {Order} from "../orders/entities/order.entity";
import {OrderItem} from "../orders/entities/order-item.enity";
import {queryLogger} from "./query-counter.logger";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'nestdb',
    entities: [User, Product, Currency, ProductPrice, Order, OrderItem],
    migrations: ['src/migrations/*.ts'],  // CLI uses TS, runtime uses JS
    synchronize: false,
    logger: queryLogger
});