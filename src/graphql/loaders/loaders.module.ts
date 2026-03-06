import {User} from "../../users/users.entity";
import {Product} from "../../products/entities/product.entity";
import {Currency} from "../../products/entities/currency.entity";
import {ProductPrice} from "../../products/entities/product-price.entity";
import {OrderItem} from "../../orders/entities/order-item.enity";
import {Order} from "../../orders/entities/order.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoadersFactory} from "./loaders.factory";
import {Module} from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([User, Product, Currency, ProductPrice, OrderItem, Order])],
    providers: [LoadersFactory],
    exports: [LoadersFactory]
})
export class LoadersModule {}