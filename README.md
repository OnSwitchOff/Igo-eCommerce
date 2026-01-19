<a href="http://nestjs.com/" target="blank"> <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /> </a>
## Description

Test eCommerce project based on the NestJS framework

## First impression
- Built-in architecture (modules, DI, decorators, tests) - clean code
- TypeScript-first – strong typing, fewer runtime errors

## Architecture overview

На перший погляд, базова архітектура проєкту імплементує MVC-патерн та включає всі ключові структурні блоки, необхідні для обробки HTTP-запитів.
Запит проходить через послідовний ланцюг відповідальностей (Chain of Responsibility), який складається з:
- Controllers
- Providers / Services
- Middlewares
- Guards
- Interceptors
- Exception Filters

Конфігурація та зв’язування компонентів здійснюється за допомогою декораторів і метаданих, визначених в анотаціях класів.

### Декоратори в DTO-моделях забезпечують:
- строгу типізацію даних у тілі запиту
- валідацію вхідних даних
- зручний доступ до headers та інших параметрів запиту

### Modules
Основними структурними одиницями системи є модулі, які використовуються для побудови ієрархії доменів та подальшого масштабування застосунку.

### Conclusion
Фреймворк спонукає до використання принципів чистої архітектури, а також практик SOLID, DDD та TDD.
Завдяки чітко визначеній структурі, dependency injection та декларативному підходу до конфігурації, він формує дисциплінований стиль розробки та полегшує підтримку й масштабування проєкту в довгостроковій перспективі.

