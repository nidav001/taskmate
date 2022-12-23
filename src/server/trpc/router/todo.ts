import { any, z } from "zod";

import { protectedProcedure, router } from "../trpc";

export const todoRouter = router({
  getTodos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        authorId: ctx.session?.user?.id,
        finalized: false,
        archived: false,
        deleted: false,
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
        id: z.string().uuid(),
        content: z.string(),
        day: z.string(),
        index: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          id: input.id,
          authorId: ctx.session.user.id,
          content: input.content,
          day: input.day,
          index: input.index,
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
          authorId: ctx.session.user.id,
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
          authorId: ctx.session.user.id,
          id: { in: input.ids },
        },
        data: {
          archived: input.done,
        },
      });
    }),
  updateTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        day: z.string(),
        result: any(),
        index: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          day: input.day,
          index: input.index,
        },
      });
    }),
  updateTodoContent: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(({ ctx, input }) => {
      if (input.content === "") {
        return ctx.prisma.todo.delete({
          where: {
            id: input.id,
          },
        });
      } else {
        return ctx.prisma.todo.update({
          where: {
            id: input.id,
          },
          data: {
            content: input.content,
          },
        });
      }
    }),
  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),
  deleteTodos: protectedProcedure
    .input(z.object({ ids: z.string().array() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.updateMany({
        where: {
          authorId: ctx.session?.user?.id,
          id: { in: input.ids },
        },
        data: {
          deleted: true,
        },
      });
    }),
});
