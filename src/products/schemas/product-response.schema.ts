import {z} from "zod";
import {preprocessBigInt} from "../../helpers/bigint.helper";
export const ProductResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    displayedName: z.string(),
    prices: z.array(
        z.object({
            id: z.uuid(),
            type: z.string(),
            amount: z.string(), //z.preprocess(preprocessBigInt, z.bigint()),
            currency: z.object({
                id: z.uuid(),
                code: z.string(),
                symbol: z.string(),
                precision: z.number()
            })
        })
    ).min(1)
});

export type ProductResponse = z.infer<typeof ProductResponseSchema>;