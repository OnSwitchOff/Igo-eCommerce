import {Product} from "./entities/product.entity";
import {ProductResponse, ProductResponseSchema} from "./schemas/product-response.schema";

export function toProductResponse(product: Product): ProductResponse {

    console.log("product.prices",product.prices);

    return ProductResponseSchema.parse({
        id: product.id,
        name: product.name,
        displayedName: product.displayedName,
        prices: product.prices.map(p => ({
            id: p.id,
            type: p.type,
            amount: p.amount,
            currency: {
                id: p.currency.id,
                code: p.currency.code,
                symbol: p.currency.symbol,
                precision: p.currency.precision
            }
        }))
    });
}