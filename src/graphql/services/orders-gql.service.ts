import {InjectRepository} from "@nestjs/typeorm";
import {BadRequestException, Injectable, InternalServerErrorException, Logger} from "@nestjs/common";
import {Repository} from "typeorm";
import {Order} from "../../orders/entities/order.entity";
import {OrdersFilterInput} from "../dto/orders.args";
import {OrderItem} from "../../orders/entities/order-item.enity";
import {toOrderType} from "../mappers/order.mapper";
import {OrdersConnection} from "../dto/orders-connection";

@Injectable()
export class OrdersGqlService {
    constructor(
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemsRepository: Repository<OrderItem>,
    ) {}

    async listOrders(args: OrdersFilterInput): Promise<OrdersConnection> {
        //throw new Error("Test error during fetching orders");
        const maxLimit = 50;
        const limit = Math.max(1, Math.min(args.limit ?? 20, maxLimit));
        const lastId =  args.cursor;
        const from = args.dateFrom;
        const to = args.dateTo;
        const status = args.status;

        const qb = this.ordersRepository.createQueryBuilder("orders")
            .orderBy("orders.createdAt", "DESC")
            .addOrderBy("orders.id", "ASC")
            .take(limit + 1);

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

        const entities = await qb.getMany() ?? [];
        // Assume we fetched limit + 1 to detect next page
        const hasNextPage = entities.length > limit;
        // Map entities to GraphQL type
        const mappedData = entities.map(entity => toOrderType(entity));
        // Slice off the extra entity if we fetched one for lookahead
        const nodes = hasNextPage ? mappedData.slice(0, -1) : mappedData;
        // Safe cursor: last element of nodes or undefined if empty
        const cursor = nodes.length > 0 ? nodes.at(-1)?.id : undefined;

        return {
            nodes,
            pageInfo: {
                cursor,
                hasNextPage,
            },
        };
    }

    async getOrderById(id: string): Promise<Order | null> {
        return this.ordersRepository.findOne({ where: { id } });
    }

    async getOrderItemsByOrderId(id: string): Promise<OrderItem[] | null> {
        return this.orderItemsRepository.find({ where: { orderId: id } });
    }
}