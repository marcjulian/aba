import * as z from 'zod';

const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  ROOT_DOMAIN: z.string(),
  API_URL: z.string(),
  APP_URL: z.string(),

  DATABASE_URL: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(env.error.issues);
  throw new Error('There is an error with the api environment variables');
}

export default (env.success ? env.data : process.env) as z.infer<
  typeof envSchema
>;
