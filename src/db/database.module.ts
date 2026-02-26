import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/users.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',          // your PostgreSQL host
            port: 5432,                 // default PostgreSQL port
            username: 'postgres',       // your DB username
            password: 'root',       // your DB password
            database: 'nestdb',         // your DB name
            entities: [User],           // register your entities here
            synchronize: false,         // never true in production!
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true,        // run migrations automatically
        }),
        TypeOrmModule.forFeature([User]),
    ],
})

export class DatabaseModule {}