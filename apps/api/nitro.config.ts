import { defineConfig } from 'nitro';

export default defineConfig({
  serverDir: './server',
  output: {
    dir: '../../dist/apps/api',
  },
  routes: {
    '/api/auth/**': './server/utils/auth.ts',
    '/api/trpc/**': './server/trpc/trpc-handler.ts',
  },
  routeRules: {
    '/api/**': {
      cors: { origin: [process.env['APP_URL']!], credentials: true },
    },
  },
});
