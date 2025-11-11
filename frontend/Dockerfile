# Etapa 1: Construcción
FROM node:18-alpine AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY tsconfig*.json vite.config.ts ./
COPY src ./src
COPY public ./public
COPY index.html ./

RUN pnpm run build

# Etapa 2: Ejecución (servidor estático simple con Node)
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
