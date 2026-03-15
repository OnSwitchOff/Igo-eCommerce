import { Product } from '../../products/entities/product.entity';
import { ProductType } from '../dto/product.type';

export function toProductType(entity: Product, price: string): ProductType {
  return {
    id: entity.id,
    title: entity.name,
    price: price,
  };
}
