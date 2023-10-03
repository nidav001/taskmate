import { type Todo } from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type Column } from "../types/column";
import { Day } from "../types/enums";

interface ColumnState {
  regularColumns: Column[];
  sharedColumns: Column[];
  setTodoOrder: (shared: boolean, columnId: Day, newTodoOrder: Todo[]) => void;
  resetTodoOrder: (shared: boolean) => void;
}

const defaultColumns = [
  { id: Day.Allgemein, todoOrder: [] },
  { id: Day.Montag, todoOrder: [] },
  { id: Day.Dienstag, todoOrder: [] },
  { id: Day.Mittwoch, todoOrder: [] },
  { id: Day.Donnerstag, todoOrder: [] },
  { id: Day.Freitag, todoOrder: [] },
  { id: Day.Samstag, todoOrder: [] },
  { id: Day.Sonntag, todoOrder: [] },
];

const useColumnStore = create<ColumnState>()(
  devtools(
    persist(
      (set) => ({
        regularColumns: defaultColumns,
        sharedColumns: defaultColumns,
        setTodoOrder: (
          shared: boolean,
          columnId: Day,
          newTodoOrder: Todo[],
        ) => {
          set((state) => {
            const columns = shared ? state.sharedColumns : state.regularColumns;
            const newColumns = columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  todoOrder: newTodoOrder,
                };
              }
              return column;
            });

            return shared
              ? { sharedColumns: newColumns }
              : { regularColumns: newColumns };
          });
        },
        resetTodoOrder: (shared: boolean) => {
          set((state) => {
            const columns = shared ? state.sharedColumns : state.regularColumns;
            const newColumns = columns.map((column) => {
              return {
                ...column,
                todoOrder: [],
              };
            });

            return shared
              ? { sharedColumns: newColumns }
              : { regularColumns: newColumns };
          });
        },
      }),

      {
        name: "todo-order-storage-v1",
      },
    ),
  ),
);

export default useColumnStore;
