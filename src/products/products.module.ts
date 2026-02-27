import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './services/products.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Currency} from "./entities/currency.entity";
import {ProductPrice} from "./entities/product-price.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Product, Currency, ProductPrice])],
    controllers:[ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}