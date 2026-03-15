import { z } from 'zod';

export const CreateOrderItemSchema = z.object({
  productId: z.uuid(),
  quantity: z.int().positive(),
  priceId: z.uuid(),
});

export type CreateOrderItemInput = z.infer<typeof CreateOrderItemSchema>;
