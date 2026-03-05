import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {Order} from "../../orders/entities/order.entity";
import {OrdersFilterInput} from "../dto/orders.args";

@Injectable()
export class OrdersGqlService {
    constructor(
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>
    ) {}

    async listOrders(args: OrdersFilterInput): Promise<Order[]> {
        const limit = Math.max(1, Math.min(args.limit ?? 20, 100));
        const lastId =  args.cursor;
        const from = args.dateFrom;
        const to = args.dateTo;
        const status = args.status;

        const qb = this.ordersRepository.createQueryBuilder("orders")
            .orderBy("orders.createdAt", "DESC")
            .addOrderBy("orders.id", "ASC")
            .take(limit);

        if (status) {
            qb.andWhere('orders.status = :status', { status: status });
        }

        if (from) {
            qb.andWhere('orders.createdAt >= :from', { from: from });
        }

        if (to) {
            qb.andWhere('orders.createdAt <= :to', { to: to });
        }

        if(lastId) {
            qb.andWhere(
                `(orders.createdAt, orders.id) > (
                    SELECT o."createdAt", o.id
                    FROM orders o
                    WHERE o.id = :lastId)`,
                { lastId }
            );
        }

        return qb.getMany();
    }

    async getOrderById(id: string): Promise<Order | null> {
        return this.ordersRepository.findOne({ where: { id } });
    }
}