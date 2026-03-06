import {Order} from "../../orders/entities/order.entity";
import {OrderType} from "../dto/order.type";


export function toOrderType(entity: Order): OrderType {
    return {
        id: entity.id,
        createdAt: entity.createdAt,
        status: entity.status,
        customerId: entity.userId
    };
}