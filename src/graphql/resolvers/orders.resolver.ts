import {Context, Parent, Query, ResolveField, Resolver} from "@nestjs/graphql";
import {Order} from "../../orders/entities/order.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../../users/users.entity";
import {GraphQLContext} from "../loaders/loaders.types";

@Resolver(() => Order)
export class OrdersResolver {
    constructor(
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    @Query(() => [Order])
    async orders(@Context() ctx: GraphQLContext): Promise<Order[]> {
        ctx.strategy = 'optimized';

        return this.ordersRepository.find({
            relations: { items: true },
            order: { createdAt: 'DESC' }
        });
    }

    @Query(() => [Order])
    async ordersNaive(@Context() ctx: GraphQLContext): Promise<Order[]> {
        ctx.strategy = 'naive';

        return this.ordersRepository.find({
            relations: { items: true },
            order: { createdAt: 'DESC' }
        });
    }

    @ResolveField(() => User, { nullable: true })
    async customer(
        @Parent() order: Order,
        @Context() ctx: GraphQLContext
    ): Promise<User | null> {
        if (ctx.strategy === 'naive') {
            return this.usersRepository.findOne({ where: { id: order.userId } });
        }

        return ctx.loaders.userByIdLoader.load(order.userId);
    }
}