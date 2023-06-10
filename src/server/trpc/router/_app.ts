import { router } from "../trpc";
import { adminRouter } from "./admin";
import { todoRouter } from "./todo";
import { userRouter } from "./user";

export const appRouter = router({
  todo: todoRouter,
  admin: adminRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
