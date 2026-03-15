import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Product } from '../products/entities/product.entity';
import { Currency } from '../products/entities/currency.entity';
import { ProductPrice } from '../products/entities/product-price.entity';
import { OrderItem } from '../orders/entities/order-item.enity';
import { Order } from '../orders/entities/order.entity';
import { queryLogger } from './query-counter.logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {FileRecord} from "../files/file-record.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
        logger: queryLogger,
      }),
    }),
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Product,
      Currency,
      ProductPrice,
      User,
      FileRecord
    ]),
  ],
})
export class DatabaseModule {}
