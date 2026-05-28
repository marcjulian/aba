import { authedProcedure, router } from '../trpc';
import { adminRouter } from './admin.router';

export const appRouter = router({
  admin: adminRouter,
  me: authedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
