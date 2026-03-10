import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.enity';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { Currency } from '../products/entities/currency.entity';
import { ProductPrice } from '../products/entities/product-price.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { User } from '../users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Product,
      Currency,
      ProductPrice,
      User,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
