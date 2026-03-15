# Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

# Встановлюємо pg_isready
RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/main.js"]