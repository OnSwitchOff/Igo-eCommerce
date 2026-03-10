import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { envFilePath } from '../app.module';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.enity';
import { Product } from '../products/entities/product.entity';
import { Currency } from '../products/entities/currency.entity';
import { ProductPrice } from '../products/entities/product-price.entity';
import { User } from '../users/users.entity';

config({ path: `./${envFilePath}` });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Order, OrderItem, Product, Currency, ProductPrice, User],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});
