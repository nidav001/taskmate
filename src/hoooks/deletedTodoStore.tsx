import { type Todo } from "@prisma/client";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface BearState {
  deletedTodos: Todo[];
  setDeletedTodos: (newTodos: Todo[]) => void;
}

const deletedTodoStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        deletedTodos: [],
        setDeletedTodos: (newTodos) => set(() => ({ deletedTodos: newTodos })),
      }),
      {
        name: "deleted-todo-storage",
      }
    )
  )
);

export default deletedTodoStore;
