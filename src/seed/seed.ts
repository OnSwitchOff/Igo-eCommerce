import { AppDataSource } from '../db/data-source';
import { User } from '../users/users.entity';
import * as bcrypt from 'bcrypt';
import {DataSource} from "typeorm";
import {Currency} from "../products/entities/currency.entity";
import {Product} from "../products/entities/product.entity";
import {ProductPrice} from "../products/entities/product-price.entity";
import {PriceType} from "../products/enums/price-type.enum";

export async function seed() {
    try {
        await AppDataSource.initialize();
        await seedDemoData(AppDataSource);
    }
    catch (ex) {
        console.log(ex);
    }
    finally {
        await AppDataSource.destroy();
    }
}

export async function seedDemoData(dataSource: DataSource){
    await seedUsers(dataSource);
    await seedCurrencies(dataSource);
    await seedProducts(dataSource);
    await updateStockQuantity(dataSource);
}

export async function seedUsers(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);

    const usersData: Partial<User>[] = [
        { name: 'Alice', email: 'alice@example.com', password: await bcrypt.hash('password123', 10) , age: 25 },
        { name: 'Bob', email: 'bob@example.com', password: await bcrypt.hash('password123', 10), age: 30 },
        { name: 'Charlie', email: 'charlie@example.com', password: await bcrypt.hash('password123', 10), age: 22 },
    ];

    await userRepository.upsert(usersData,['email'])

    console.log('✅ Users seeded!');
}

export async function seedCurrencies(dataSource: DataSource)  {
    const currencyRepository = dataSource.getRepository(Currency);

    const currenciesToUpsert: Partial<Currency>[] = [
        { code: "USD", name: "US Dollar", symbol: "$", precision: 2, isDefault: true },
        { code: "EUR", name: "Euro", symbol: "€", precision: 2, isDefault: false },
        { code: "UAH", name: "Hryvnia", symbol: "₴", precision: 2, isDefault: false },
    ];

    await currencyRepository.upsert(currenciesToUpsert,['code'])

    console.log("✅ Currencies seeded");
}

export async function seedProducts (dataSource: DataSource) {

    const productRepository = dataSource.getRepository(Product);
    const priceRepository = dataSource.getRepository(ProductPrice);
    const currencyRepository = dataSource.getRepository(Currency);

    // Fetch currencies
    const usd = await currencyRepository.findOne({ where: { code: "USD" } });
    const eur = await currencyRepository.findOne({ where: { code: "EUR" } });
    if (!usd || !eur) throw new Error("Currencies must be seeded first");

    const existing = await productRepository.findOne({
        where: { name: "T-Shirt" },
    });

    if (existing) return existing;

    const productToUpsert: Partial<Product> = {
        name: "T-Shirt",
        displayedName: "T-Shirt Premium"
    };
    const result = await productRepository.upsert(productToUpsert, ['id']);
    const productId = result.identifiers[0].id;
    // Prices (time-based)
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);

    const pricesToUpsert: Array<Partial<ProductPrice>> = [{
            type: PriceType.SALE,
            amount: 1999n,      // $19.99 in minor units
            currency: usd,
            validFrom: now,
            validTo: nextMonth,
            isActive: true,
            product: { id: productId } as Product,
        },
        {
            type: PriceType.OFFER,
            amount: 1499n,      // $14.99 offer
            currency: usd,
            validFrom: now,
            validTo: nextMonth,
            isActive: true,
            product: { id: productId } as Product,
        },
    ];
    await priceRepository.upsert(pricesToUpsert, ['id']);
    console.log("✅ Products seeded");
}

export async function updateStockQuantity (dataSource: DataSource) {
    const productRepository = dataSource.getRepository(Product);
    const quantity = 100;
    await productRepository.createQueryBuilder()
        .update()
        .set({ stock: quantity })
        .execute();
    console.log("✅ Products stocks updated");
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});