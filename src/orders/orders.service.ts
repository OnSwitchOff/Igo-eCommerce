import {Injectable} from "@nestjs/common";
import {DataSource, DeepPartial, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Currency} from "../products/entities/currency.entity";
import {OrderItem} from "./entities/order-item.enity";
import {Order} from "./entities/order.entity";
import {ProductPrice} from "../products/entities/product-price.entity";
import {User} from "../users/users.entity";
import {OrderStatus} from "./enums/order-status.enum";
import {Product} from "../products/entities/product.entity";

@Injectable()
export class OrdersService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly itemsRepository: Repository<OrderItem>,
    ) {}

    async create(validated) {
        const existing = await this.ordersRepository.findOne({
            where: { idempotencyKey: validated.idempotencyKey },
            relations: { items: true }
        });

        if (existing) {
            return existing;
        }

        return this.dataSource.transaction(async (manager) => {

            const ordersRepository = manager.getRepository(Order);
            const itemsRepository = manager.getRepository(OrderItem);
            const usersRepository = manager.getRepository(User);
            const pricesRepository = manager.getRepository(ProductPrice);
            const productsRepository = manager.getRepository(Product);

            const user = await usersRepository.findOne({ where: { id: validated.userId } });
            if (!user) {
                throw new Error('User not found');
            }

            const order: Order = ordersRepository.create({
                idempotencyKey: validated.idempotencyKey,
                userId: user.id,
                user: user,
                status: OrderStatus.CREATED
            });
            await ordersRepository.save(order);

            const orderItems: DeepPartial<OrderItem>[] = validated.prices.map(async (item) => {
                const product: Product | null = await productsRepository.findOne({ where: { id: item.productId.toString() } });
                if (!product) {
                    throw new Error('product not found');
                }
                const priceId= item.priceId.toString();
                const currencyId = item.currencyId.toString();
                const price = await pricesRepository.findOne({
                    relations: ['currency'],
                    where: { id: priceId }
                });

                console.log("price", price);

                if (!price) {
                    throw new Error('price not found');
                }
                return {
                    order: order,
                    orderId: order.id,
                    currency: price.currency,
                    currencyId: price.currency.id,
                    product: product,
                    productId: product.id,
                    price: price,
                    quantity: item.quantity
                }
            });
            await itemsRepository.upsert(await Promise.all(orderItems), ['id']);

            const created = await ordersRepository.findOne({
                where: { id: order.id },
                relations: { items: true },
            });

            if (!created) {
                throw new Error('Product creation failed');
            }

            return created;
        });
    }

    async findAll(): Promise<Order[]> {
        return await this.ordersRepository.find({
            order: { createdAt: "DESC" },
            relations: { items: true}
        });
    }

    async findById(id: string): Promise<Order| null>  {
        return await this.ordersRepository.findOne({
            where: { id },
            relations: { items: true}
        });
    }
}