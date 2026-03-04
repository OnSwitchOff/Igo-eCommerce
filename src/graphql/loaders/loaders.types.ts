import DataLoader from "dataloader";
import {User} from "../../users/users.entity";
import {Product} from "../../products/entities/product.entity";

export type AppLoaders = {
    userByIdLoader: DataLoader<string, User | null>;
    productByIdLoader: DataLoader<string, Product | null>;
};

export type GraphQLContext = {
    loaders: AppLoaders;
    strategy?: 'naive' | 'optimized';
};