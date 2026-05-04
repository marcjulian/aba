FROM node:24-alpine

WORKDIR /app

COPY dist/apps/app .

EXPOSE 4200
CMD ["node", "server/server.mjs"]