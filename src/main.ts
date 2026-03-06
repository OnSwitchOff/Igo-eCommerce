import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {queryLogger} from "./db/query-counter.logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    queryLogger.queryCount = 0;
    res.on("finish", () => {
      console.log("SQL queries executed:", queryLogger.queryCount);
    });
    next();
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
