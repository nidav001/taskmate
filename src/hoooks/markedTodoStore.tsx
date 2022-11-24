import { type Todo } from "@prisma/client";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TodoState {
  markedTodos: Todo[];
  addMarkedTodo: (newTodo: Todo) => void;
  resetMarkedTodos: () => void;
}

const useMarkedTodoStore = create<TodoState>()(
  devtools(
    persist(
      (set) => ({
        markedTodos: [],
        addMarkedTodo: (newTodo) =>
          set((state) => ({ markedTodos: [...state.markedTodos, newTodo] })),
        resetMarkedTodos: () => set(() => ({ markedTodos: [] })),
      }),
      {
        name: "marked-todo-storage",
      }
    )
  )
);

export default useMarkedTodoStore;
