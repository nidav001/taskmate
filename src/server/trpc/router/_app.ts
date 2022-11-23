import { router } from "../trpc";
import { adminRouter } from "./admin";
import { todoRouter } from "./todo";

export const appRouter = router({
  todo: todoRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
