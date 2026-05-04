# Angular + Better Auth

## Todo

- docker
- docker ci

## Commands

Better Auth

```bash
# generate schema
pnpm dlx auth@latest generate --config apps/api/server/utils/auth.ts
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
