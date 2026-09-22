# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiar dependencias ya preparadas
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules

# Copiar el servidor Node.js, datos de respaldo y archivos compilados de Vite
COPY server.js ./
COPY server ./server
COPY data ./data
COPY --from=builder /app/dist ./dist

# Puerto 80 expuesto por defecto
EXPOSE 80

CMD ["node", "server.js"]
