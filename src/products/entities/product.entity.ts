import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany, CreateDateColumn, UpdateDateColumn, VersionColumn, Index,
} from "typeorm";
import { ProductPrice } from "./product-price.entity";
import {OrderItem} from "../../orders/entities/order-item.enity";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ nullable: true, name: "displayed_name"  })
    displayedName?: string;

    @OneToMany(() => ProductPrice, price => price.product, {cascade: true})
    prices!: ProductPrice[];

    @OneToMany(() => OrderItem, (item) => item.product)
    orderItems: OrderItem[];

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;

    @Column({ nullable: false, default:0 })
    stock: number;

    @VersionColumn({ nullable: false, default:1 })
    version: number;
}