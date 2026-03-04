import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import {AppModule} from "../src/app.module";
import {seedDemoData} from "../src/seed/seed";
import {User} from "../src/users/users.entity";
import {Product} from "../src/products/entities/product.entity";
import {Order} from "../src/orders/entities/order.entity";
import { v4 as uuidv4 } from 'uuid';

describe('Orders Idempotency (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userId;
  let productId;
  let priceId;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);
    await seedDemoData(dataSource);

    const user = await dataSource.getRepository(User).findOne({ where: { name: "Bob" } });
    userId = user!.id;

    const product = await dataSource.getRepository(Product).findOne({ where: { name: "T-Shirt" }, relations: ['prices'] });
    productId = product!.id;
    priceId = product!.prices[0].id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should handle parallel same idempotency key without 500 and return same order', async () => {
    const idempotencyKey = uuidv4();

    const payload = {
      idempotencyKey:idempotencyKey,
      userId: userId,
      items:
          [
            {
              productId: productId,
              quantity: 1,
              priceId: priceId
            }
          ]
    };

    // 🔥 ДВА ПАРАЛЕЛЬНІ ЗАПИТИ
    const [res1, res2] = await Promise.all([
      request(app.getHttpServer())
          .post('/orders')
          .send(payload),

      request(app.getHttpServer())
          .post('/orders')
          .send(payload),
    ]);

    // ✅ жоден не впав
    expect(res1.status).not.toBe(500);
    expect(res2.status).not.toBe(500);

    expect([200, 201]).toContain(res1.status);
    expect([200, 201]).toContain(res2.status);

    // ✅ повертається один і той самий order
    expect(res1.body.id).toBeDefined();
    expect(res2.body.id).toBeDefined();
    expect(res1.body.id).toEqual(res2.body.id);

    expect(res1.body.items).toBeDefined();
    expect(res2.body.items).toBeDefined();
    expect(res1.body.items.length).toEqual(res2.body.items.length);

    // ✅ у БД тільки один запис
    const count = await dataSource.getRepository(Order).count({
      where: { idempotencyKey },
    });

    expect(count).toBe(1);
  });
});