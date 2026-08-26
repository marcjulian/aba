# aba - Angular + Better Auth

1. [Angular](https://angular.io/) the frontend framework for building web applications
2. [Better Auth](https://www.better-auth.com/) the authentication framework
3. [spartan/ui](https://spartan.ng/) accessible, customizable components for Angular applications
4. [tRPC](https://trpc.io/) end-to-end typesafe APIs
5. [Prisma](https://www.prisma.io/) database migration and ORM
6. [NX](https://nx.dev/) monorepo tool for managing multiple applications and libraries in a single repository

## Quick Start

Install dependencies

```bash
pnpm install
```

Copy the `.env.dev` file and fill in the `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` values.

```bash
cp .env.dev .env
```

Start postgres database with docker compose

```bash
docker compose up -d
```

Run the prisma migration to create the database and tables:

```bash
pnpm prisma migrate dev
```

Serve the analog app

```bash
pnpm start
```

Visit [localhost:5173](http://localhost:5173) to see the app running.

Sign up a new user and than you can seed the database with dummy data

```bash
pnpm prisma db seed
```

### Better Auth

Run the following command to update prisma schema base on the Better Auth configuration:

```bash
# generate schema
pnpm auth generate --config apps/api/server/utils/auth.ts
```

### Prisma

Run the following command to create the database and run the migrations:

```bash
pnpm prisma migrate dev
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

## App SSR

Build app and run app locally allowing access from localhost

```bash
pnpm build

NG_ALLOWED_HOSTS=localhost,127.0.0.1 node dist/apps/app/server/server.mjs
```

## Apps in Docker

To run the application in Docker, update the `.env` file to point to the docker container names instead of `localhost` (database, redis, rustfs, better-auth).

The dockerfiles for the apps require the apps to be built first before starting the container.

```bash
pnpm build
```

Start the containers in detached mode:

```bash
docker compose -f compose.prod.yml up -d
```

When you rebuild the app use this command to rebuild the docker images:

```bash
docker compose -f compose.prod.yml up -d --build
```
