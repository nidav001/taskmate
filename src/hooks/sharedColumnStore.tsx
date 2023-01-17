import { type Todo } from "@prisma/client";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type Column } from "../types/column";
import { Day } from "../types/enums";

interface ColumnState {
  sharedColumns: Column[];
  setSharedColumnTodoOrder: (columnId: Day, newTodoOrder: Todo[]) => void;
  resetSharedColumnTodoOrder: () => void;
}

const useSharedColumnStore = create<ColumnState>()(
  devtools(
    persist(
      (set) => ({
        sharedColumns: [
          { id: Day.Allgemein, todoOrder: [] },
          { id: Day.Montag, todoOrder: [] },
          { id: Day.Dienstag, todoOrder: [] },
          { id: Day.Mittwoch, todoOrder: [] },
          { id: Day.Donnerstag, todoOrder: [] },
          { id: Day.Freitag, todoOrder: [] },
          { id: Day.Samstag, todoOrder: [] },
          { id: Day.Sonntag, todoOrder: [] },
        ],
        setSharedColumnTodoOrder: (columnId: Day, newTodoOrder: Todo[]) => {
          set((state) => {
            const newColumns = state.sharedColumns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  todoOrder: newTodoOrder,
                };
              }
              return column;
            });

            return {
              sharedColumns: newColumns,
            };
          });
        },
        resetSharedColumnTodoOrder: () => {
          set((state) => {
            const newColumns = state.sharedColumns.map((column) => {
              return {
                ...column,
                todoOrder: [],
              };
            });

            return {
              sharedColumns: newColumns,
            };
          });
        },
      }),

      {
        name: "shared-todoorder-storage",
      }
    )
  )
);

export default useSharedColumnStore;
