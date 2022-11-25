import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Column {
  id: string;
  todoOrder: string[];
}

interface TodoState {
  columns: Column[];
  setColumnTodoOrder: (columnId: string, newTodoOrder: string[]) => void;
  resetTodoOrder: () => void;
}

const useTodoOrderStore = create<TodoState>()(
  devtools(
    persist(
      (set) => ({
        columns: [
          { id: "Montag", todoOrder: [] },
          { id: "Dienstag", todoOrder: [] },
          { id: "Mittwoch", todoOrder: [] },
          { id: "Donnerstag", todoOrder: [] },
          { id: "Freitag", todoOrder: [] },
          { id: "Samstag", todoOrder: [] },
          { id: "Sonntag", todoOrder: [] },
        ],
        setColumnTodoOrder: (columnId: string, newTodoOrder: string[]) => {
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
        name: "todo-order-storage",
      }
    )
  )
);

export default useTodoOrderStore;
