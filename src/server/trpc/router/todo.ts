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
        finalized: true,
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
  setChecked: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        checked: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          checked: input.checked,
        },
      });
    }),
  finalizeTodos: protectedProcedure
    .input(z.object({ ids: z.string().array(), checked: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.updateMany({
        where: {
          authorId: ctx.session.user.id,
          id: { in: input.ids },
        },
        data: {
          finalized: input.checked,
          checked: false,
        },
      });
    }),
  archiveTodos: protectedProcedure
    .input(z.object({ ids: z.string().array(), checked: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.updateMany({
        where: {
          authorId: ctx.session.user.id,
          id: { in: input.ids },
        },
        data: {
          archived: input.checked,
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
  deleteFinalizedTodos: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.todo.deleteMany({
      where: {
        authorId: ctx.session?.user?.id,
        finalized: true,
      },
    });
  }),
  getMostRecentTodo: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findFirst({
      where: {
        authorId: ctx.session?.user?.id,
        finalized: false,
        archived: false,
        deleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  restoreTodos: protectedProcedure
    .input(z.object({ ids: z.string().array() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.updateMany({
        where: {
          authorId: ctx.session?.user?.id,
          id: { in: input.ids },
        },
        data: {
          finalized: false,
          checked: false,
        },
      });
    }),
});
