import {Field, GraphQLISODateTime, ID, ObjectType, registerEnumType} from "@nestjs/graphql";
import {OrderStatus} from "../../orders/enums/order-status.enum";
import {UserType} from "./user.type";
import {OrderItemType} from "./order-item.type";

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class OrderType {
    @Field(() => ID)
    id: string;

    @Field(() => OrderStatus)
    status: OrderStatus;

    @Field(() => String)
    total?: string;

    @Field(() => GraphQLISODateTime)
    createdAt: Date;

    @Field(() => ID)
    customerId: string;
    @Field(() => UserType,{ nullable: true })
    customer?: UserType;

    @Field(type=>[OrderItemType], {nullable: "itemsAndList"})
    items?: OrderItemType[];
}


