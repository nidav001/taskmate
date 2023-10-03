import { type Todo } from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TodoState {
  regularTodos: Todo[];
  sharedTodos: Todo[];
  setTodos: (shared: boolean, newTodos: Todo[]) => void;
  resetTodos: (shared: boolean) => void;
}

const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      (set) => ({
        regularTodos: [],
        sharedTodos: [],
        setTodos: (shared, newTodos) => {
          set(() => {
            return shared
              ? { sharedTodos: newTodos }
              : { regularTodos: newTodos };
          });
        },
        resetTodos: (shared) =>
          set(() => {
            return shared ? { sharedTodos: [] } : { regularTodos: [] };
          }),
      }),

      {
        name: "todo-storage-v1",
      },
    ),
  ),
);

export default useTodoStore;
