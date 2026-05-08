import { defineConfig } from 'nitro';

export default defineConfig({
  serverDir: './server',
  routes: {
    '/api/auth/**': './server/utils/auth-route.ts',
    '/api/trpc/**': './server/trpc/trpc-handler.ts',
  },
});
