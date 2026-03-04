import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../users/users.entity";
import {In, Repository} from "typeorm";
import {Product} from "../../products/entities/product.entity";
import {AppLoaders} from "./loaders.types";
import DataLoader from "dataloader";

@Injectable()
export class LoadersFactory {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
    ) {}

    create(): AppLoaders {
        return {
            userByIdLoader: new DataLoader<string, User | null>(async (ids) => {
                if (ids.length === 0) {
                    return [];
                }

                const users = await this.usersRepository.find({ where: { id: In([...ids]) } });
                const usersById = new Map(users.map((user) => [user.id, user]));

                return ids.map((id) => usersById.get(id) ?? null);
            }),
            productByIdLoader: new DataLoader<string, Product | null>(async (ids) => {
                if (ids.length === 0) {
                    return [];
                }

                const products = await this.productsRepository.find({
                    where: { id: In([...ids]) }
                });
                const productsById = new Map(products.map((product) => [product.id, product]));

                return ids.map((id) => productsById.get(id) ?? null);
            })
        };
    }
}