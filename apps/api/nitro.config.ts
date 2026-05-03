import { defineConfig } from 'nitro';

export default defineConfig({
  serverDir: './server',
  routes: {
    '/api/auth/**': './server/utils/auth-route.ts',
  },
});
