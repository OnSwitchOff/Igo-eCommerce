import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
} from "typeorm";
import { ProductPrice } from "./product-price.entity";

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
}