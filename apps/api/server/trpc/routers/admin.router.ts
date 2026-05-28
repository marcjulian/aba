import { prisma } from '../../utils/prisma';
import { adminProcedure, router } from '../trpc';

export const adminRouter = router({
  stats: adminProcedure.query(async () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [totalUsers, newUsersLast7Days, newUsersPrior7Days] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
    ]);

    const newUsersTrend =
      newUsersPrior7Days === 0
        ? 0
        : Math.round(((newUsersLast7Days - newUsersPrior7Days) / newUsersPrior7Days) * 100);

    return {
      totalUsers,
      newUsersLast7Days,
      newUsersTrend,
    };
  }),
});
