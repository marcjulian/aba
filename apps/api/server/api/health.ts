import { defineHandler } from 'nitro';

export default defineHandler(() => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});
