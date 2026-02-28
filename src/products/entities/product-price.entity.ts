import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    Index, JoinColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { Currency } from "./currency.entity";
import { PriceType } from "../enums/price-type.enum";

@Entity("product_prices")
@Index(["product", "type", "validFrom", "validTo"])
export class ProductPrice {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'uuid', name: 'product_id' })
    productId: string;
    @ManyToOne(() => Product, product => product.prices, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({
        type: "enum",
        enum: PriceType,
    })
    type: PriceType;

    @Column({ type: "bigint" })
    amount: bigint; // stored in minor units

    @Column({ type: 'uuid', name: 'currency_id' })
    currencyId: string;
    @ManyToOne(() => Currency)
    @JoinColumn({ name: 'currency_id' })
    currency: Currency;

    @Column({ type: "timestamptz", name: "valid_from" })
    validFrom: Date;

    @Column({ type: "timestamptz", name: "valid_to" , nullable: true })
    validTo?: Date;

    @Column({ default: true, name: "is_active"  })
    isActive: boolean;
}