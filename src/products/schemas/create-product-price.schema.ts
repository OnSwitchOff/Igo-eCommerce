import {PriceType} from "../enums/price-type.enum";
import {z} from "zod";

export const CreateProductPriceSchema = z.object({
    type: z.enum(PriceType),
    amount: z.number().int().nonnegative(),  // minor units
    currencyId: z.uuid(),
    validFrom: z.string().transform(s => new Date(s)), // accept ISO string
    validTo: z.string().optional().transform(s => s ? new Date(s) : s),
    isActive: z.boolean().optional().default(true),
});


export type CreateProductPriceInput = z.infer<typeof CreateProductPriceSchema>;