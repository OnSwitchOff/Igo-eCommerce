import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './db/database.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AppGraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import {FilesModule} from "./files/files.module";

export const envFilePath = (() => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return '.env.production';
    case 'docker':
      return '.env.docker';
    case 'test':
      return '.env.test';
    default:
      return '.env.development';
  }
})();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    AppGraphqlModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
