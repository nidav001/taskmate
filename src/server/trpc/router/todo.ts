import { any, z } from "zod";

import { protectedProcedure, router } from "../trpc";

export const todoRouter = router({
  getOpenTodos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        authorId: ctx.session?.user?.id,
        finalized: false,
        shared: false,
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
  getGeneralTodos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        authorId: ctx.session?.user?.id,
        // general: true,
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
        shared: z.boolean(),
        sharedWithEmail: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.shared) input.sharedWithEmail = "";
      return ctx.prisma.todo.create({
        data: {
          id: input.id,
          authorId: ctx.session.user.id,
          content: input.content,
          day: input.day,
          index: input.index,
          shared: input.shared,
          sharedWithEmail: input.sharedWithEmail,
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
    .input(z.object({ ids: z.string().array() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.updateMany({
        where: {
          authorId: ctx.session.user.id,
          id: { in: input.ids },
        },
        data: {
          finalized: true,
          checked: false,
        },
      });
    }),
  updateTodoPosition: protectedProcedure
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
  getSharedTodos: protectedProcedure
    .input(
      z.object({ sharedWithEmail: z.string(), authorId: z.string().optional() })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.todo.findMany({
        where: {
          OR: [
            {
              sharedWithEmail: input.sharedWithEmail,
              authorId: ctx.session?.user?.id,
            },
            {
              authorId: input.authorId,
              sharedWithEmail: ctx.session?.user?.email ?? "",
            },
          ],
          AND: [
            {
              shared: true,
            },
          ],
        },
      });
    }),
  //unused
  shareTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        sharedWithEmail: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          shared: true,
          sharedWithEmail: input.sharedWithEmail,
        },
      });
    }),
  //unused
  unshareTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          shared: false,
          sharedWithEmail: "",
        },
      });
    }),
  getCollaborators: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        OR: [
          {
            authorId: ctx.session?.user?.id,
          },
          {
            sharedWithEmail: ctx.session?.user?.email ?? "",
          },
        ],
        AND: {
          shared: true,
        },
      },
      select: {
        sharedWithEmail: true,
      },
    });
  }),
});
