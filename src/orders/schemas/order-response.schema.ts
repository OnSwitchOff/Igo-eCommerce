import { z } from 'zod';
import { OrderStatus } from '../enums/order-status.enum';
import { preprocessBigInt } from '../../helpers/bigint.helper';

export const OrderResponseSchema = z.object({
  id: z.uuid(),
  idempotencyKey: z.uuid(),
  status: z.enum(OrderStatus),
  createdAt: z.date(),
  items: z
    .array(
      z.object({
        id: z.uuid(),
        title: z.string(),
        price: z.string(), //z.preprocess(preprocessBigInt, z.bigint()),
        quantity: z.number(),
        currency: z.string(),
      }),
    )
    .min(1),
});

export type OrderResponse = z.infer<typeof OrderResponseSchema>;
