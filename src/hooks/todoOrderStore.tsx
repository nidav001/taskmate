import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TodoState {
  todoOrder: string[];
  setTodoOrder: (newOrder: string[]) => void;
  resetTodoOrder: () => void;
}

const useTodoOrderStore = create<TodoState>()(
  devtools(
    persist(
      (set) => ({
        todoOrder: [],
        setTodoOrder: (newOrder) => {
          set(() => {
            return { todoOrder: newOrder };
          });
        },
        resetTodoOrder: () => {
          set(() => {
            return { todoOrder: [] };
          });
        },
      }),

      {
        name: "todo-order-storage",
      }
    )
  )
);

export default useTodoOrderStore;
