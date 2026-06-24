FROM node:24-alpine

WORKDIR /app

COPY dist/apps/api .

EXPOSE 3000

CMD ["node", "server/index.mjs"]