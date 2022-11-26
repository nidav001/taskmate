import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Day } from "../types/enums";

interface Column {
  id: Day;
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
          { id: Day.Montag, todoOrder: [] },
          { id: Day.Dienstag, todoOrder: [] },
          { id: Day.Mittwoch, todoOrder: [] },
          { id: Day.Donnerstag, todoOrder: [] },
          { id: Day.Freitag, todoOrder: [] },
          { id: Day.Samstag, todoOrder: [] },
          { id: Day.Sonntag, todoOrder: [] },
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
