import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const todoRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getTodos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        authorId: ctx.session?.user?.id,
      },
    });
  }),
  addTodo: protectedProcedure
    .input(
      z.object({
        title: z.string().nullish(),
        content: z.string().nullish(),
        type: z.string(),
        sharedWithId: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    )
    .mutation(({ ctx, input }) => {
      console.log(input.type);
      return ctx.prisma.todo.create({
        data: {
          authorId: ctx.session.user.id,
          title: input.title ?? "",
          content: input.content ?? "",
          type: input.type,
          sharedWithId: input.sharedWithId ?? null,
          dueDate: input.dueDate ?? null,
        },
      });
    }),
});
