import { protectedProcedure, router } from "../trpc";

export const adminRouter = router({
  deArchiveTodos: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.todo.updateMany({
      where: {
        authorId: ctx.session?.user?.id,
        archived: true,
      },
      data: {
        archived: false,
      },
    });
  }),
  restoreTodos: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.todo.updateMany({
      where: {
        authorId: ctx.session?.user?.id,
        deleted: true,
      },
      data: {
        deleted: false,
      },
    });
  }),
});
