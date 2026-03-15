import DataLoader from 'dataloader';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/users.entity';
import { OrderItem } from '../../orders/entities/order-item.enity';

export type AppLoaders = {
  userByIdLoader: DataLoader<string, User | null>;
  productByIdLoader: DataLoader<string, Product | null>;
  orderItemsByOrderIdLoader: DataLoader<string, OrderItem[]>;
  orderTotalByOrderIdLoader: DataLoader<string, string>;
};

export type GraphQLContext = {
  loaders: AppLoaders;
  req: any;
};
