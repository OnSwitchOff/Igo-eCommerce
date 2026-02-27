export interface Product {
    id: string;
    name: string;
    price: Price;
    offerPrice?: Price;
}

export interface Price {
    value: bigint; // in cents
    currency: string;
}