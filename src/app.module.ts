import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import {DatabaseModule} from "./db/database.module";
import {ProductsModule} from "./products/products.module";
import {OrdersModule} from "./orders/orders.module";
import {AppGraphqlModule} from "./graphql/graphql.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    AppGraphqlModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
