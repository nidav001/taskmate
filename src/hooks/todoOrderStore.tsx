import { type Todo } from "@prisma/client";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Column {
  id: number;
  todoOrder: Todo[];
}

interface TodoOrderState {
  columns: Column[];
  setColumnTodoOrder: (columnId: number, newTodoOrder: Todo[]) => void;
  resetTodoOrder: () => void;
}

const useTodoOrderStore = create<TodoOrderState>()(
  devtools(
    persist(
      (set) => ({
        columns: [
          { id: 1, todoOrder: [] },
          { id: 2, todoOrder: [] },
          { id: 3, todoOrder: [] },
          { id: 4, todoOrder: [] },
          { id: 5, todoOrder: [] },
          { id: 6, todoOrder: [] },
          { id: 7, todoOrder: [] },
        ],
        setColumnTodoOrder: (columnId: number, newTodoOrder: Todo[]) => {
          set((state) => {
            const newColumns = state.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  todoOrder: newTodoOrder,
                };
              }
              return column;
            });

            return {
              columns: newColumns,
            };
          });
        },
        resetTodoOrder: () => {
          set((state) => {
            const newColumns = state.columns.map((column) => {
              return {
                ...column,
                todoOrder: [],
              };
            });

            return {
              columns: newColumns,
            };
          });
        },
      }),

      {
        name: "todo-order-storage1",
      }
    )
  )
);

export default useTodoOrderStore;
