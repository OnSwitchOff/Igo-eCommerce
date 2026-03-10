import { AppDataSource } from '../db/data-source';
import { User } from '../users/users.entity';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Currency } from '../products/entities/currency.entity';
import { Product } from '../products/entities/product.entity';
import { ProductPrice } from '../products/entities/product-price.entity';
import { PriceType } from '../products/enums/price-type.enum';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../orders/enums/order-status.enum';
import { OrderItem } from '../orders/entities/order-item.enity';

export async function seed() {
  try {
    await AppDataSource.initialize();
    await seedDemoData(AppDataSource);
  } catch (ex) {
    console.log(ex);
  } finally {
    await AppDataSource.destroy();
  }
}

export async function seedDemoData(dataSource: DataSource) {
  await seedUsers(dataSource);
  await seedCurrencies(dataSource);
  await seedProducts(dataSource);
  await updateStockQuantity(dataSource);
  await seedOrders(dataSource);
}

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const passwordHash = await bcrypt.hash('password123', 10);
  const usersData: Partial<User>[] = [
    {
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: passwordHash,
      age: 25,
      roles: ['user'],
      scopes: ['orders:read', 'orders:write'],
    },
    {
      name: 'Bob',
      email: 'bob@example.com',
      passwordHash: passwordHash,
      age: 30,
      roles: ['support'],
      scopes: ['orders:read', 'payments:read', 'payments:write'],
    },
    {
      name: 'Charlie',
      email: 'admin@example.com',
      passwordHash: passwordHash,
      age: 22,
      roles: ['admin'],
      scopes: [
        'orders:read',
        'orders:write',
        'payments:read',
        'payments:write',
        'refunds:write',
      ],
    },
  ];

  await userRepository.upsert(usersData, ['email']);

  console.log('✅ Users seeded!');
}

export async function seedCurrencies(dataSource: DataSource) {
  const currencyRepository = dataSource.getRepository(Currency);

  const currenciesToUpsert: Partial<Currency>[] = [
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      precision: 2,
      isDefault: true,
    },
    { code: 'EUR', name: 'Euro', symbol: '€', precision: 2, isDefault: false },
    {
      code: 'UAH',
      name: 'Hryvnia',
      symbol: '₴',
      precision: 2,
      isDefault: false,
    },
  ];

  await currencyRepository.upsert(currenciesToUpsert, ['code']);

  console.log('✅ Currencies seeded');
}

export async function seedProducts(dataSource: DataSource) {
  const productRepository = dataSource.getRepository(Product);
  const priceRepository = dataSource.getRepository(ProductPrice);
  const currencyRepository = dataSource.getRepository(Currency);

  // Fetch currencies
  const usd = await currencyRepository.findOne({ where: { code: 'USD' } });
  const eur = await currencyRepository.findOne({ where: { code: 'EUR' } });
  if (!usd || !eur) throw new Error('Currencies must be seeded first');

  const existing = await productRepository.findOne({
    where: { name: 'T-Shirt' },
  });

  if (existing) return existing;

  const productToUpsert: Partial<Product> = {
    name: 'T-Shirt',
    displayedName: 'T-Shirt Premium',
  };
  const result = await productRepository.upsert(productToUpsert, ['id']);
  const productId = result.identifiers[0].id;
  // Prices (time-based)
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(now.getMonth() + 1);

  const pricesToUpsert: Array<Partial<ProductPrice>> = [
    {
      type: PriceType.SALE,
      amount: 1999n, // $19.99 in minor units
      currency: usd,
      validFrom: now,
      validTo: nextMonth,
      isActive: true,
      product: { id: productId } as Product,
    },
    {
      type: PriceType.OFFER,
      amount: 1499n, // $14.99 offer
      currency: usd,
      validFrom: now,
      validTo: nextMonth,
      isActive: true,
      product: { id: productId } as Product,
    },
  ];
  await priceRepository.upsert(pricesToUpsert, ['id']);
  console.log('✅ Products seeded');
}

export async function updateStockQuantity(dataSource: DataSource) {
  const productRepository = dataSource.getRepository(Product);
  const quantity = 100;
  await productRepository
    .createQueryBuilder()
    .update()
    .set({ stock: quantity })
    .execute();
  console.log('✅ Products stocks updated');
}

export async function seedOrders(dataSource: DataSource) {
  const productRepository = dataSource.getRepository(Product);
  const itemsRepository = dataSource.getRepository(OrderItem);
  const ordersRepository = dataSource.getRepository(Order);
  const usersRepository = dataSource.getRepository(User);

  const testKey = 'f3b498ef-bc38-47a2-9b3a-6d21e4f67a27';

  //fetch order
  const existingOrder: Order | null = await ordersRepository.findOne({
    where: { idempotencyKey: testKey },
  });
  if (existingOrder) {
    console.log('✅ Demo Order existed');
    return;
  }

  //fetch product
  const existingProduct: Product | null = await productRepository.findOne({
    where: { name: 'T-Shirt' },
    relations: ['prices', 'prices.currency'],
  });
  if (!existingProduct) throw new Error('Products must be seeded first');
  const product: Product = existingProduct!;

  const existingUser: User | null = await usersRepository.findOne({
    where: { email: 'admin@example.com' },
  });
  if (!existingUser) throw new Error('Users must be seeded first');
  const user: User = existingUser!;

  const orderToUpsert: Partial<Order> = {
    idempotencyKey: testKey,
    userId: user.id,
    user: user,
    status: OrderStatus.CREATED,
  };
  const result = await ordersRepository.upsert(orderToUpsert, ['id']);
  const orderId = result.identifiers[0].id;
  // orderItems
  const itemsToUpsert: Array<Partial<OrderItem>> = [
    {
      orderId: orderId,
      product: product,
      productId: product.id,
      price: 1999n,
      currency: product.prices[0].currency,
      currencyId: product.prices[0].currencyId,
      quantity: 1,
    },
  ];
  await itemsRepository.upsert(itemsToUpsert, ['id']);
  console.log('✅ Order seeded');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
