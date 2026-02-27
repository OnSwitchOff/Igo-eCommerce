import {Injectable, NotFoundException} from '@nestjs/common';
import {Product} from '../entities/product.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, DeepPartial, Repository} from "typeorm";
import {Currency} from "../entities/currency.entity";
import {ProductPrice} from "../entities/product-price.entity";
import {PriceType} from "../enums/price-type.enum";

@Injectable()
export class ProductsService  {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Currency)
    private readonly currenciesRepository: Repository<Currency>,
    @InjectRepository(ProductPrice)
    private readonly productPricesRepository: Repository<ProductPrice>,
  ) {}

  async create(validated) {
      return this.dataSource.transaction(async (manager) => {

          const productsRepository = manager.getRepository(Product);
          const pricesRepository = manager.getRepository(ProductPrice);
          const currenciesRepository = manager.getRepository(Currency);

          const product: Product = productsRepository.create({
              name: validated.name,
              displayedName: validated.displayedName
          });
          await productsRepository.save(product);

          const productPrices: DeepPartial<ProductPrice>[] = validated.prices.map(async (price) => {
              const currency: Currency | null = await currenciesRepository.findOne({ where: { id: price.currencyId.toString() } });
              if (!currency) {
                  throw new Error('currency not found');
              }
              return {
                  type: price.type,
                  amount: price.amount,
                  validFrom: price.validFrom,
                  validTo: price.validTo,
                  isActive: price.isActive,
                  currency: currency,
                  product: product,
              }
          });
          await pricesRepository.upsert(await Promise.all(productPrices), ['id']);

          const created = await productsRepository.findOne({
              where: { id: product.id },
              relations: { prices: true },
          });

          if (!created) {
              throw new Error('Product creation failed');
          }

          return created;
      });
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
        order: {name: "ASC"},
        relations: { prices: true}
    });
  }

  async findById(id: string): Promise<Product| null>  {
    return await this.productsRepository.findOne({
      where: { id },
      relations: { prices: true}
    });
  }
}