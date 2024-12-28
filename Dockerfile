FROM node:18-alpine AS builder
LABEL authors="muthuri_dev"

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build \ && npm prune --production \ && rm -rf src test

USER node
EXPOSE 3000

CMD ["node", "dist/main"]