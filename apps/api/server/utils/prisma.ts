import { PrismaPg } from '@prisma/adapter-pg';
import env from './env';
import { PrismaClient } from './generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: env.DATABASE_URL,
    }),
  });

globalForPrisma.prisma = prisma;
