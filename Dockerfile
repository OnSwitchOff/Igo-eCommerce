# =========================
# Stage 1: Dependencies
# =========================
FROM node:20-alpine AS deps
WORKDIR /app

# Копіюємо lockfile та package.json
COPY package*.json ./

# Встановлюємо всі залежності
RUN npm ci

# =========================
# Stage 2: Build
# =========================
FROM node:20-alpine AS build
WORKDIR /app

# Копіюємо node_modules та код
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# =========================
# Stage 3: Development target
# =========================
FROM node:20-alpine AS dev
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Виставляємо DEV режим
ENV NODE_ENV=development
EXPOSE 3001

# Запуск з nodemon або стандартним ts-node для dev
CMD ["npm", "run", "start:dev"]

# =========================
# Stage 4: Production target
# =========================
FROM node:20-alpine AS prod
WORKDIR /app

# Копіюємо лише runtime залежності та dist
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main.js"]

# =========================
# Stage 5: Production distroless
# =========================
FROM gcr.io/distroless/nodejs:20 AS prod-distroless
WORKDIR /app

# Копіюємо тільки runtime залежності та dist
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 3001

# CMD повинен бути масивом для distroless
CMD ["dist/main.js"]