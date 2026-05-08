FROM node:24-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

COPY package.json ./

RUN PNPM_VERSION=$(node -p "require('./package.json').packageManager.split('@')[1]") && \
    PRISMA_VERSION=$(node -p "require('./package.json').devDependencies.prisma") && \
    DOTENV_VERSION=$(node -p "require('./package.json').devDependencies.dotenv") && \
    npm install -g pnpm@$PNPM_VERSION && \
    rm package.json && \
    pnpm add prisma@$PRISMA_VERSION dotenv@$DOTENV_VERSION

COPY prisma.config.ts ./
COPY prisma ./prisma

CMD ["pnpm", "prisma", "migrate", "deploy"]