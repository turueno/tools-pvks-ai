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
ENV PORT=80

# Copiar dependencias de producción
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copiar el servidor Node.js y los archivos compilados del frontend
COPY server.js ./
COPY server ./server
COPY --from=builder /app/dist ./dist

# Puerto expuesto por defecto (Railway inyectará PORT dinámico)
EXPOSE 80

CMD ["node", "server.js"]
