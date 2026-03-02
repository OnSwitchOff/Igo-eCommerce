import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../../products/entities/product.entity";
import {Order} from "./order.entity";
import {Currency} from "../../products/entities/currency.entity";

@Index('IDX_order_items_order_id', ['orderId'])
@Index('IDX_order_items_product_id', ['productId'])
@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'order_id' })
    orderId: string;
    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ type: 'uuid', name: 'product_id' })
    productId: string;
    @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: "bigint" })
    price: bigint;

    @Column({ type: 'uuid', name: 'currency_id' })
    currencyId: string;
    @ManyToOne(() => Currency)
    @JoinColumn({ name: 'currency_id' })
    currency: Currency;
}