import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getUsersByIds: protectedProcedure
    .input(
      z.object({
        ids: z.string().array(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          id: { in: input.ids },
        },
      });
    }),
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
