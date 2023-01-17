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
      console.log(input.ids);
      return ctx.prisma.user.findMany({
        where: {
          id: { in: input.ids },
        },
      });
    }),
});
