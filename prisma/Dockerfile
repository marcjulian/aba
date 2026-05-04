FROM node:24-alpine

WORKDIR /app

COPY prisma.config.ts ./
COPY prisma ./prisma

RUN npm install dotenv
RUN npm install prisma@7.8.0

CMD ["sh", "-c", "npx prisma migrate deploy"]