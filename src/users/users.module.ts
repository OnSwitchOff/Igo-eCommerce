import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {UsersRepository} from "./users.repository";
import {Order} from "../orders/entities/order.entity";
import {OrderItem} from "../orders/entities/order-item.enity";
import {Product} from "../products/entities/product.entity";
import {Currency} from "../products/entities/currency.entity";
import {ProductPrice} from "../products/entities/product-price.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, Currency, ProductPrice, User])],
	controllers:[UsersController],
	providers: [UsersService, UsersRepository],
	exports: [UsersService],
})
export class UsersModule {}
