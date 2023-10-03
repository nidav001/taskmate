import { type Todo } from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TodoState {
  finalizedTodos: Todo[];
  setFinalizedTodos: (newTodos: Todo[]) => void;
  resetFinalizedTodos: () => void;
}

const useFinalizedTodoStore = create<TodoState>()(
  devtools(
    persist(
      (set) => ({
        finalizedTodos: [],
        setFinalizedTodos: (newTodos) => {
          set(() => {
            return { finalizedTodos: newTodos };
          });
        },
        resetFinalizedTodos: () => set(() => ({ finalizedTodos: [] })),
      }),

      {
        name: "todo-storage",
      },
    ),
  ),
);

export default useFinalizedTodoStore;
