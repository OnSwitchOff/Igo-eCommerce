import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/users.entity";
import {Product} from "../products/entities/product.entity";
import {Currency} from "../products/entities/currency.entity";
import {ProductPrice} from "../products/entities/product-price.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',          // your PostgreSQL host
            port: 5432,                 // default PostgreSQL port
            username: 'postgres',       // your DB username
            password: 'root',       // your DB password
            database: 'nestdb',         // your DB name
            entities: [User, Product, Currency, ProductPrice],           // register your entities here
            synchronize: false,         // never true in production!
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true,        // run migrations automatically
        }),
        TypeOrmModule.forFeature([User, Product, Currency, ProductPrice]),
    ],
})

export class DatabaseModule {}