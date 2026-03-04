Домашнє завдання
Домашнє завдання 4: GraphQL для Orders + DataLoader

Мета: реалізувати GraphQL API для Orders у курсовому e-commerce бекенді на NestJS так, щоб:

GraphQL schema була контрактом (types / inputs / enums / nullability),
резолвери перевикористовували існуючі сервіси (без дублювання бізнес-логіки),
ви уникнули N+1 за допомогою DataLoader.
На виході ви маєте:

працюючий GraphQL endpoint /graphql;
Query orders зі вкладеними items → product;
DataLoader для Product (або іншої “гарячої” сутності), який прибирає N+1;
короткий опис у README / homework07.md:
як реалізовані schema / resolvers / dataloader;
як ви перевірили, що N+1 зник.