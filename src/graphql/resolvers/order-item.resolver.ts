import { Resolver, ResolveField, Parent, Context } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GraphQLContext } from '../loaders/loaders.types';
import {OrderItem} from "../../orders/entities/order-item.enity";
import {Product} from "../../products/entities/product.entity";

@Resolver(() => OrderItem)
export class OrderItemResolver {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
    ) {}

    @ResolveField(() => Product, { nullable: true })
    async product(
        @Parent() orderItem: OrderItem,
        @Context() ctx: GraphQLContext
    ): Promise<Product | null> {
        if (ctx.strategy === 'naive') {
            return this.productsRepository.findOne({ where: { id: orderItem.productId } });
        }

        return ctx.loaders.productByIdLoader.load(orderItem.productId);
    }
}