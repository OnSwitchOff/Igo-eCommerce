import {
  Args,
  Context,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLContext } from '../loaders/loaders.types';
import { OrdersGqlService } from '../services/orders-gql.service';
import { OrderType } from '../dto/order.type';
import { Order } from '../../orders/entities/order.entity';
import { OrdersFilterInput } from '../dto/orders.args';
import { UserType } from '../dto/user.type';
import { User } from '../../users/users.entity';
import { OrderItemType } from '../dto/order-item.type';
import { OrderItem } from '../../orders/entities/order-item.enity';
import { toProductType } from '../mappers/product.mapper';
import { toOrderItemType } from '../mappers/order-item.mapper';
import { toOrderType } from '../mappers/order.mapper';
import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { GraphQLExceptionFilter } from '../gql.exception-filter';
import { OrdersConnection } from '../dto/orders-connection';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { Roles } from '../../auth/roles.decorator';
import { CurrentUser } from '../../auth/current-user.decorator';

@Resolver(() => OrderType)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersGqlService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => OrdersConnection)
  @UseFilters(GraphQLExceptionFilter)
  async orders(@Args() args: OrdersFilterInput): Promise<OrdersConnection> {
    //throw new BadRequestException("Test bad input exception");
    return await this.ordersService.listOrders(args);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => OrderType, { nullable: true })
  async order(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ): Promise<OrderType | null> {
    console.log('Received id:', id);
    console.log('Current user:', user);
    const entity = await this.ordersService.getOrderById(id);
    if (!entity) {
      return null;
    }

    if (entity.userId !== user.userId && !user.roles?.includes('admin')) {
      return null;
    }

    return toOrderType(entity);
  }

  @ResolveField(() => UserType, { nullable: true })
  async customer(
    @Parent() order: OrderType,
    @Context() ctx: GraphQLContext,
  ): Promise<User | null> {
    return ctx.loaders.userByIdLoader.load(order.customerId);
  }

  @ResolveField(() => [OrderItemType])
  async items(
    @Parent() order: OrderType,
    @Context() ctx: GraphQLContext,
  ): Promise<OrderItemType[]> {
    const entities: OrderItem[] =
      (await this.ordersService.getOrderItemsByOrderId(order.id)) ?? [];

    // const entities= await ctx.loaders.orderItemsByOrderIdLoader.load(order.id);
    // if (!entities) {
    //     return [];
    // }
    return entities.map((entity) => {
      return toOrderItemType(entity);
    });
  }

  @ResolveField(() => String)
  async total(
    @Parent() order: OrderType,
    @Context() ctx: GraphQLContext,
  ): Promise<string> {
    return ctx.loaders.orderTotalByOrderIdLoader.load(order.id);
  }
}
