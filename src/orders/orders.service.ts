import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import {DataSource, DeepPartial, QueryDeepPartialEntity, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {OrderItem} from "./entities/order-item.enity";
import {Order} from "./entities/order.entity";
import {ProductPrice} from "../products/entities/product-price.entity";
import {User} from "../users/users.entity";
import {OrderStatus} from "./enums/order-status.enum";
import {Product} from "../products/entities/product.entity";
import {CreateOrderInput} from "./schemas/create-order.schema";
import {compare} from "bcrypt";
import {UNHANDLED_RUNTIME_EXCEPTION} from "@nestjs/core/errors/messages";

@Injectable()
export class OrdersService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly itemsRepository: Repository<OrderItem>,
    ) {}

    async create(validated: CreateOrderInput) {
        const existing = await this.ordersRepository.findOne({
            where: { idempotencyKey: validated.idempotencyKey },
            relations: [ 'user', 'items', 'items.product', 'items.currency'],
        });

        if (existing) {
            console.log("existing",existing);
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
                throw new NotFoundException('User not found');
            }

            await ordersRepository
                .createQueryBuilder()
                .insert()
                .into(Order)
                .values({
                    idempotencyKey: validated.idempotencyKey,
                    userId: user.id,
                    status: OrderStatus.CREATED
                })
                .orIgnore()
                .execute();

            const order = await ordersRepository.findOne({
                where: { idempotencyKey: validated.idempotencyKey }
            });

            if (!order) {
                throw new InternalServerErrorException(
                    'Order creation failed unexpectedly'
                );
            }

            const orderItems: Promise<QueryDeepPartialEntity<OrderItem>>[]  = validated.items.map(async (item) => {
                const product: Product | null = await productsRepository.findOne({ where: { id: item.productId.toString() } });
                if (!product) {
                    throw new NotFoundException('product not found');
                }

                if (product.stock < item.quantity) {
                    throw new ConflictException(`Product ${product.id} is out of stock`);
                }

                await this.decrementStock(product, item.quantity, productsRepository);

                const priceId= item.priceId.toString();
                const price = await pricesRepository.findOne({
                    relations: ['currency'],
                    where: { id: priceId }
                });

                if (!price) {
                    throw new NotFoundException('price not found');
                }

                const result: QueryDeepPartialEntity<OrderItem> = {
                    order: order,
                    orderId: order.id,
                    product: product,
                    productId: product.id,
                    currency: price.currency,
                    currencyId: price.currency.id,
                    price: price.amount,
                    quantity: item.quantity
                }

                return result;
            });

            await itemsRepository.upsert(await Promise.all(orderItems), ['id']);

            const created = await ordersRepository.findOne({
                where: { id: order.id },
                relations: [ 'user', 'items', 'items.product', 'items.currency'],
            });

            if (!created) {
                throw new Error('Order creation failed');
            }

            console.log(created);
            return created;
        });
    }

    private async decrementStock(product: Product, quantity: number, productsRepository: Repository<Product>) {
        for (let attempt = 0; attempt < 3; attempt++) {
            const currentVersion = product.version;

            const result = await productsRepository.createQueryBuilder()
                .update(Product)
                .set({ stock: () => `stock - ${quantity}`, version: product.version + 1 })
                .where("id = :id AND stock >= :qty AND version = :version", {
                    id: product.id,
                    qty: quantity,
                    version: currentVersion
                })
                .returning(['id', 'stock', 'version'])
                .execute();

            if (result.affected && result.affected > 0) {
                product.stock = result.raw[0].stock;
                product.version = result.raw[0].version;
                return;
            }

            const freshProduct = await productsRepository.findOne({ where: { id: product.id } });
            if (!freshProduct || freshProduct.stock < quantity) {
                throw new ConflictException(`Product(${product.id}) is out of stock`);
            }

            product = freshProduct;
        }

        throw new ConflictException(`Could not update product(${product.id}) stock  is out of stock`);
    }


    async findAll(): Promise<Order[]> {
        return await this.ordersRepository.find({
            order: { createdAt: "DESC" },
            relations: [ 'user', 'items', 'items.product', 'items.currency'],
        });
    }

    async findById(id: string): Promise<Order| null>  {
        return await this.ordersRepository.findOne({
            where: { id },
            relations: [ 'user', 'items', 'items.product', 'items.currency'],
        });
    }
}