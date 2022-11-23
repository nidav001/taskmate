import { any, z } from "zod";

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
        finalized: false,
        archived: false,
      },
    });
  }),
  getFinalizedTodos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        authorId: ctx.session?.user?.id,
        done: true,
        finalized: true,
        archived: false,
      },
    });
  }),
  getArchivedTodos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        authorId: ctx.session?.user?.id,
        done: false,
        finalized: false,
        archived: true,
      },
    });
  }),
  getDeletedTodos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        authorId: ctx.session?.user?.id,
        deleted: true,
      },
    });
  }),
  addTodo: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        day: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          authorId: ctx.session.user.id,
          content: input.content,
          day: input.day,
        },
      });
    }),
  setTodoDone: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: input.done,
        },
      });
    }),
  finalizeTodos: protectedProcedure
    .input(z.object({ ids: z.string().array(), done: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.updateMany({
        where: {
          id: { in: input.ids },
        },
        data: {
          finalized: input.done,
        },
      });
    }),
  archiveTodos: protectedProcedure
    .input(z.object({ ids: z.string().array(), done: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.updateMany({
        where: {
          id: { in: input.ids },
        },
        data: {
          archived: input.done,
        },
      });
    }),
  changeDayAfterDnD: protectedProcedure
    .input(z.object({ id: z.string(), day: z.string(), result: any() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          day: input.day,
        },
      });
    }),
  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          authorId: ctx.session?.user?.id,
          id: input.id,
        },
      });
    }),
});
