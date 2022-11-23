import { protectedProcedure, router } from "../trpc";

export const adminRouter = router({
  dearchiveTodos: protectedProcedure.mutation(({ ctx }) => {
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
});
