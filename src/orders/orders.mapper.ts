import { Order } from './entities/order.entity';
import {
  OrderResponse,
  OrderResponseSchema,
} from './schemas/order-response.schema';

export function toOrderResponse(order: Order): OrderResponse {
  return OrderResponseSchema.parse({
    id: order.id,
    idempotencyKey: order.idempotencyKey,
    status: order.status,
    createdAt: order.createdAt,
    items: order.items.map((i) => ({
      id: i.id,
      title: i.product.name,
      price: i.price,
      quantity: i.quantity,
      currency: i.currency.symbol,
    })),
  });
}
