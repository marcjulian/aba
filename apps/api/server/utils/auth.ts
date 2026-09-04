import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import env from './env';
import { prisma } from './prisma';

export const auth = betterAuth({
  baseURL: env.API_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.APP_URL],
  advanced: {
    // enable cross subdomain cookies for auth sessions, when api and app are on different subdomains of the same root domain
    crossSubDomainCookies: {
      enabled: true,
      domain: env.ROOT_DOMAIN,
    },
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: { enabled: true },
  plugins: [admin()],
});

export default { fetch: auth.handler };
