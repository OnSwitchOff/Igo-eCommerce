import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/users.entity";
import {Product} from "../products/entities/product.entity";
import {Currency} from "../products/entities/currency.entity";
import {ProductPrice} from "../products/entities/product-price.entity";
import {OrderItem} from "../orders/entities/order-item.enity";
import {Order} from "../orders/entities/order.entity";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {LoadersModule} from "./loaders/loaders.module";
import {LoadersFactory} from "./loaders/loaders.factory";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Product, Currency, ProductPrice, OrderItem, Order]),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [LoadersModule],
            inject: [LoadersFactory],
            useFactory: (loadersFactory: LoadersFactory) => ({
                autoSchemaFile: true,
                path: '/graphql',
                graphiql: true,
                introspection: true,
                context: () => ({
                    loaders: loadersFactory.create(),
                    strategy: 'optimized' as const
                })
            })
        })
    ],
    providers: [OrdersResolver, OrderItemResolver]
})
export class AppGraphqlModule {}