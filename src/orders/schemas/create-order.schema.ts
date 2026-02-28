import {z} from "zod";
import {CreateOrderItemSchema} from "./create-order-item.schema";

export const CreateOrderSchema = z.object({
    idempotencyKey: z.uuid(),
    userId: z.uuid(),
    items: z.array(CreateOrderItemSchema).min(1)
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;