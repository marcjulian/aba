import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
  baseURL: process.env['BETTER_AUTH_URL'],
  secret: process.env['BETTER_AUTH_SECRET'],
  trustedOrigins: [process.env['APP_URL']!],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: { enabled: true },
});
