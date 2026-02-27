import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("currencies")
export class Currency {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 3, unique: true })
    code: string; // ISO 4217

    @Column()
    name: string;

    @Column({ length: 5 })
    symbol: string;

    @Column()
    precision: number; // 2 for USD, 0 for JPY

    @Column({ name: "is_default" })
    isDefault: boolean = false;
}