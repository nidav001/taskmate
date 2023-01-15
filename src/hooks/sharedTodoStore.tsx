import { type Todo } from "@prisma/client";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TodoState {
  todos: Todo[];
  setTodos: (newTodos: Todo[]) => void;
  resetTodos: () => void;
}

const useSharedTodoStore = create<TodoState>()(
  devtools(
    persist(
      (set) => ({
        todos: [],
        setTodos: (newTodos) => {
          set(() => {
            return { todos: newTodos };
          });
        },
        resetTodos: () => set(() => ({ todos: [] })),
      }),

      {
        name: "shared-todo-storage",
      }
    )
  )
);

export default useSharedTodoStore;
