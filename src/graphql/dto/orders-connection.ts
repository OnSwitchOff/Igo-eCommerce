import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './page-info';
import { OrderType } from './order.type';

@ObjectType()
export class OrdersConnection {
  @Field(() => [OrderType])
  nodes: OrderType[];

  @Field(() => PageInfo)
  pageInfo?: PageInfo;
}
