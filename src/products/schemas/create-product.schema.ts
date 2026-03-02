import {z} from "zod";
import {CreateProductPriceSchema} from "./create-product-price.schema";

export const CreateProductSchema = z.object({
    name: z.string().min(1),
    displayedName: z.string().optional(),
    prices: z.array(CreateProductPriceSchema).min(1),
    quantity: z.number().default(100)
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

