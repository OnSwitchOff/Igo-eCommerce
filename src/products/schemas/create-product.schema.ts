import {z} from "zod";
import {createProductPriceSchema} from "./create-product-price.schema";

export const createProductSchema = z.object({
    name: z.string().min(1),
    displayedName: z.string().optional(),
    prices: z.array(createProductPriceSchema).min(1),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;