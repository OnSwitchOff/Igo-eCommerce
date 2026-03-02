**1. Як реалізована транзакція:**

 Транзакція забеспучує атомарність операції (захист від  partial writes)
 
 Працює завдяки виклику усіх маніпуляцій з даним у врапері
 ```ts
 this.dataSource.transaction(async (manager) {
    ...
 })
 ```

Приклад можна побачити у методі create
[Orders Service](src/orders/orders.service.ts)
[Product Service](src/products/services/products.service.ts)    


**2. Який механізм конкурентності обрано:**

Обрано варіант 2 optimistic concurrency

додано version до сутності Product,
atomic update з перевіркою версії,
при conflict - retry (3 рази).

Приклад можна побачити у методі decrementStock
[Orders Service](src/orders/orders.service.ts)


**3. Як працює ідемпотентність:**

в схему створеня ордеру додано idempotencyKey
[CreateOrderSchema](src/orders/schemas/create-order.schema.ts)
який перевіряється на унікальність в сервісі, і видається існуюче замовлення, якщо такий ключ вже є в базі

 ```ts
    const existing = await this.ordersRepository.findOne({
        where: { idempotencyKey: validated.idempotencyKey },
        relations: [ 'user', 'items', 'items.product', 'items.currency'],
    });

    if (existing) {
        return existing;
    }
 ```
**4. Який запит оптимізували, та які індекси додали:**

 ```sql
    EXPLAIN ANALYZE
    SELECT 
    o.id AS order_id,
    o.status,
    o.created_at,
    u.id AS user_id,
    u.name AS user_name,
    i.quantity,
    p.name AS product_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items i ON i.order_id = o.id
    JOIN products p ON i.product_id = p.id
    WHERE o.status = 'CREATED'
      AND o.created_at >= '2026-01-01'
    ORDER BY  o.created_at DESC, o.id 
    LIMIT 50;
 ```
 
```
"Limit  (cost=40.43..40.56 rows=50 width=274) (actual time=0.127..0.129 rows=6.00 loops=1)"
"  Buffers: shared hit=13"
"  ->  Sort  (cost=40.43..41.08 rows=260 width=274) (actual time=0.126..0.128 rows=6.00 loops=1)"
"        Sort Key: o.created_at DESC, o.id"
"        Sort Method: quicksort  Memory: 25kB"
"        Buffers: shared hit=13"
"        ->  Hash Join  (cost=10.33..31.79 rows=260 width=274) (actual time=0.113..0.118 rows=6.00 loops=1)"
"              Hash Cond: (i.product_id = p.id)"
"              Buffers: shared hit=13"
"              ->  Hash Join  (cost=9.29..30.05 rows=260 width=282) (actual time=0.072..0.076 rows=6.00 loops=1)"
"                    Hash Cond: (i.order_id = o.id)"
"                    Buffers: shared hit=12"
"                    ->  Seq Scan on order_items i  (cost=0.00..17.80 rows=780 width=36) (actual time=0.006..0.007 rows=6.00 loops=1)"
"                          Buffers: shared hit=1"
"                    ->  Hash  (cost=9.28..9.28 rows=1 width=262) (actual time=0.033..0.034 rows=5.00 loops=1)"
"                          Buckets: 1024  Batches: 1  Memory Usage: 9kB"
"                          Buffers: shared hit=11"
"                          ->  Nested Loop  (cost=0.14..9.28 rows=1 width=262) (actual time=0.023..0.030 rows=5.00 loops=1)"
"                                Buffers: shared hit=11"
"                                ->  Seq Scan on orders o  (cost=0.00..1.04 rows=1 width=44) (actual time=0.006..0.007 rows=5.00 loops=1)"
"                                      Filter: ((created_at >= '2026-01-01 00:00:00+02'::timestamp with time zone) AND (status = 'CREATED'::orders_status_enum))"
"                                      Buffers: shared hit=1"
"                                ->  Index Scan using ""PK_a3ffb1c0c8416b9fc6f907b7433"" on users u  (cost=0.14..8.16 rows=1 width=234) (actual time=0.004..0.004 rows=1.00 loops=5)"
"                                      Index Cond: (id = o.user_id)"
"                                      Index Searches: 5"
"                                      Buffers: shared hit=10"
"              ->  Hash  (cost=1.02..1.02 rows=2 width=24) (actual time=0.031..0.032 rows=2.00 loops=1)"
"                    Buckets: 1024  Batches: 1  Memory Usage: 9kB"
"                    Buffers: shared hit=1"
"                    ->  Seq Scan on products p  (cost=0.00..1.02 rows=2 width=24) (actual time=0.027..0.028 rows=2.00 loops=1)"
"                          Buffers: shared hit=1"
"Planning Time: 0.344 ms"
"Execution Time: 0.174 ms"
```


<details>
<summary>EXPLAIN before optimization</summary>

![EXPLAIN before optimization](assets/Explaine%20Analize%20(pre).jpg)

</details>

Додавання індексів

```ts
@Index('IDX_orders_status', ['status'])
@Index('IDX_orders_user_id', ['userId'])
@Index('IDX_orders_created_at', ['createdAt'])
@Entity('orders')
```
```ts
@Index('IDX_order_items_order_id', ['orderId'])
@Index('IDX_order_items_product_id', ['productId'])
@Entity('order_items')
```

<details>
<summary>EXPLAIN after adding indexes optimization</summary>

![EXPLAIN after adding indexes optimization](assets/Explaine%20Analize%20(post1).jpg)

</details>

переписування запиту
 ```sql
    EXPLAIN ANALYZE
    WITH recent_orders AS (
        SELECT *
        FROM orders
        WHERE status = 'CREATED'
        AND created_at >= '2026-01-01'
        ORDER BY created_at DESC
        LIMIT 50
    )
    SELECT 
        o.id AS order_id,
        o.status,
        o.created_at,
        u.id AS user_id,
        u.name AS user_name,
        i.quantity,
        p.name AS product_name
    FROM recent_orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items i ON i.order_id = o.id
    JOIN products p ON i.product_id = p.id;
 ```

 ```
 "Nested Loop  (cost=1.23..11.51 rows=1 width=274) (actual time=0.055..0.099 rows=6.00 loops=1)"
"  Join Filter: (i.product_id = p.id)"
"  Rows Removed by Join Filter: 1"
"  Buffers: shared hit=22"
"  ->  Nested Loop  (cost=1.23..10.47 rows=1 width=282) (actual time=0.049..0.074 rows=6.00 loops=1)"
"        Join Filter: (i.order_id = orders.id)"
"        Rows Removed by Join Filter: 24"
"        Buffers: shared hit=16"
"        ->  Nested Loop  (cost=1.23..9.33 rows=1 width=262) (actual time=0.041..0.051 rows=5.00 loops=1)"
"              Buffers: shared hit=11"
"              ->  Limit  (cost=1.08..1.09 rows=1 width=68) (actual time=0.025..0.026 rows=5.00 loops=1)"
"                    Buffers: shared hit=1"
"                    ->  Sort  (cost=1.08..1.09 rows=1 width=68) (actual time=0.025..0.025 rows=5.00 loops=1)"
"                          Sort Key: orders.created_at DESC"
"                          Sort Method: quicksort  Memory: 25kB"
"                          Buffers: shared hit=1"
"                          ->  Seq Scan on orders  (cost=0.00..1.07 rows=1 width=68) (actual time=0.017..0.018 rows=5.00 loops=1)"
"                                Filter: ((created_at >= '2026-01-01 00:00:00+02'::timestamp with time zone) AND (status = 'CREATED'::orders_status_enum))"
"                                Buffers: shared hit=1"
"              ->  Index Scan using ""PK_a3ffb1c0c8416b9fc6f907b7433"" on users u  (cost=0.14..8.16 rows=1 width=234) (actual time=0.004..0.004 rows=1.00 loops=5)"
"                    Index Cond: (id = orders.user_id)"
"                    Index Searches: 5"
"                    Buffers: shared hit=10"
"        ->  Seq Scan on order_items i  (cost=0.00..1.06 rows=6 width=36) (actual time=0.002..0.002 rows=6.00 loops=5)"
"              Buffers: shared hit=5"
"  ->  Seq Scan on products p  (cost=0.00..1.02 rows=2 width=24) (actual time=0.002..0.002 rows=1.17 loops=6)"
"        Buffers: shared hit=6"
"Planning Time: 0.310 ms"
"Execution Time: 0.130 ms"
 ```

<details>
<summary>EXPLAIN after rewriting query </summary>

![EXPLAIN after adding indexes optimization](assets/Explaine%20Analize%20(post1).jpg)

</details>

Висновок:
`EXPLAIN ANALYZE` виконує запит на реальних даних, які зараз є в базі, і показує реальний час та реальну кількість рядків.
Тому складно покращити перфоменс при роботі з невеликою кількість данних.

**5. Обробка помилок**

- не знайдено сутності:  ```throw new NotFoundException('User not found'); ```
- недостатній stock:  ```throw new ConflictException(`Product ${product.id} is out of stock`); ```
- duplicate idempotencyKey:  ```не викликає помилку (повертає існуючий заказ) ```
- будь-яка інша помилка:  ```throw new Error('Order creation failed'); ```

ймовірно ще треба додати  ```BadRequestException``` і обробку помилок ```Zod``` валідації
