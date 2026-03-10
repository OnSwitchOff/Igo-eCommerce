import { Resolver, ResolveField, Parent, Context } from '@nestjs/graphql';
import { GraphQLContext } from '../loaders/loaders.types';
import { OrderItem } from '../../orders/entities/order-item.enity';
import { Product } from '../../products/entities/product.entity';
import { ProductType } from '../dto/product.type';
import { OrderItemType } from '../dto/order-item.type';
import { toProductType } from '../mappers/product.mapper';

@Resolver(() => OrderItemType)
export class OrderItemResolver {
  @ResolveField(() => ProductType, { nullable: true })
  async product(
    @Parent() orderItem: OrderItemType,
    @Context() ctx: GraphQLContext,
  ): Promise<ProductType | null> {
    const entity = await ctx.loaders.productByIdLoader.load(
      orderItem.productId,
    );
    if (!entity) {
      return null;
    }
    return toProductType(entity, orderItem.priceAtPurchase);
  }
}
