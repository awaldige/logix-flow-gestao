# syntax = docker/dockerfile:1

ARG NODE_VERSION=24.15.0
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app
ENV NODE_ENV=production

FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential node-gyp openssl pkg-config python-is-python3

# Copia tudo PRIMEIRO (evita Prisma quebrado)
COPY . .

# instala dependências
RUN npm install

# gera Prisma depois que schema já existe
RUN npx prisma generate

# build TS
RUN npm run build

FROM base

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /app /app

EXPOSE 3000
CMD ["npm", "run", "start"]