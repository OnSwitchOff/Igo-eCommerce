import { OrderItem } from '../../orders/entities/order-item.enity';
import { OrderItemType } from '../dto/order-item.type';
export function toOrderItemType(entity: OrderItem): OrderItemType {
  return {
    id: entity.id,
    quantity: entity.quantity,
    productId: entity.productId,
    priceAtPurchase: entity.price.toString(),
  };
}
