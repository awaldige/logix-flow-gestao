# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.15.0
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app
ENV NODE_ENV=production

# =========================
# BUILD STAGE
# =========================
FROM base AS build

RUN apt-get update -qq && apt-get install -y \
    openssl \
    python-is-python3 \
    build-essential

# Copia dependências primeiro (cache correto)
COPY package*.json ./

# 🔥 IMPORTANTE: garantir devDependencies
RUN npm install --include=dev

# copia resto do código
COPY . .

# Prisma (schema já existe aqui)
RUN npx prisma generate

# TypeScript compilação FORÇADA (sem npx estranho)
RUN ./node_modules/.bin/tsc

# =========================
# FINAL IMAGE
# =========================
FROM base

RUN apt-get update -qq && apt-get install -y openssl

COPY --from=build /app /app

EXPOSE 3000

CMD ["node", "dist/server.js"]