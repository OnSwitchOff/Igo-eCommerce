***Домашнє завдання: GraphQL для Orders + DataLoader***

**1 Який домен інтегрували (Users чи Products)**

- Users

**2 Як працює presign → upload → complete?**

Presign (генерація підписаного URL)
Сервер звертається до minio і просить створити presigned URL.
Це URL із підписом, який дає обмежений час доступу для завантаження конкретного файлу.


Upload (завантаження файлу через підписаний URL)
Клієнт використовує отриманий presigned URL для завантаження файлу.
minio перевіряє підпис і дозволяє завантаження лише якщо URL ще дійсний.

Complete (підтвердження завершення)
Сервер отримує від клієнта сигнал, що upload завершено.
Після цього файл стає доступним за URL у сховищі.

Перевага: сервер не обробляє файл, економить трафік і ресурси.

**3 Як реалізовані перевірки доступу?**

Завдяки JwtAuthGuard та Bearer Token ми отримуємо контекст AuthUser
та порівнюемо його айді з айді власника файла у таблиці files([FileRecords])
або перевіряємо його роль адміністратора

**4 Як формується URL для перегляду?**

Завдяки методу buildPublicUrl формується URL у форматі ````https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}````

```
  buildPublicUrl(key: string): string {
        if (this.cloudfrontBaseUrl) {
            return `${this.cloudfrontBaseUrl}/${key}`;
        }

        if (this.endpoint) {
            const endpoint = this.trimTrailingSlash(this.endpoint) ?? this.endpoint;

            if (this.forcePathStyle) {
                return `${endpoint}/${this.bucket}/${key}`;
            }

            return `${endpoint}/${key}`;
        }

        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
```