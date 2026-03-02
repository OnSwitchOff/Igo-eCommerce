import {
    Column,
    CreateDateColumn,
    Entity, Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../users/users.entity";
import {OrderItem} from "./order-item.enity";
import {OrderStatus} from "../enums/order-status.enum";

@Index('IDX_orders_status', ['status'])
@Index('IDX_orders_user_id', ['userId'])
@Index('IDX_orders_created_at', ['createdAt'])
@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column({ type: 'uuid', name: 'idempotency_key', unique: true })
    idempotencyKey: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderItem, (item) => item.order)
    items: OrderItem[];

    @Column({
        type: 'enum',
        enum: OrderStatus,
        enumName: 'orders_status_enum',
        default: OrderStatus.CREATED
    })
    status: OrderStatus;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;
}