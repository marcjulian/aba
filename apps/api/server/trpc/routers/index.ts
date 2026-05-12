import { authedProcedure, router } from '../trpc';

export const appRouter = router({
  me: authedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
