FROM node:24-alpine

WORKDIR /app

COPY apps/api/.output .

EXPOSE 3000

CMD ["node", "server/index.mjs"]