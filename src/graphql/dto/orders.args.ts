import {ArgsType, Field, GraphQLISODateTime, ID, Int} from "@nestjs/graphql";
import {PaginationArgs} from "./pagination.args";
import {OrderStatus} from "../../orders/enums/order-status.enum";

@ArgsType()
export class OrdersFilterInput extends PaginationArgs {
    @Field(type => OrderStatus, {nullable: true})
    status?: OrderStatus;
    @Field(type => GraphQLISODateTime, {nullable: true})
    dateFrom?: String;
    @Field(type => GraphQLISODateTime, {nullable: true})
    dateTo?: String;
}