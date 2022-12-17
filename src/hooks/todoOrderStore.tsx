import { type Todo } from "@prisma/client";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Day } from "../types/enums";

interface Column {
  id: Day;
  todoOrder: Todo[];
}

interface TodoOrderState {
  columns: Column[];
  setColumnTodoOrder: (columnId: Day, newTodoOrder: Todo[]) => void;
  resetTodoOrder: () => void;
}

const useTodoOrderStore = create<TodoOrderState>()(
  devtools(
    persist(
      (set) => ({
        columns: [
          { id: Day.Allgemein, todoOrder: [] },
          { id: Day.Montag, todoOrder: [] },
          { id: Day.Dienstag, todoOrder: [] },
          { id: Day.Mittwoch, todoOrder: [] },
          { id: Day.Donnerstag, todoOrder: [] },
          { id: Day.Freitag, todoOrder: [] },
          { id: Day.Samstag, todoOrder: [] },
          { id: Day.Sonntag, todoOrder: [] },
        ],
        setColumnTodoOrder: (columnId: Day, newTodoOrder: Todo[]) => {
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
        name: "todoorder-storage",
      }
    )
  )
);

export default useTodoOrderStore;
