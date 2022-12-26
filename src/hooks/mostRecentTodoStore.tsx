import { DateTime } from "luxon";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MostRecentTodoIdState {
  mostRecentTodoId: string;
  setMostRecentTodoId: (newId: string) => void;
  todoCreatedAtMilliseconds: number;
  setTodoCreatedAtMilliseconds: (newCreatedAt: number) => void;
}

const useMostRecentTodoIdStore = create<MostRecentTodoIdState>()(
  devtools(
    persist(
      (set) => ({
        mostRecentTodoId: "",
        setMostRecentTodoId: (newId) => {
          set((state) => {
            state.setTodoCreatedAtMilliseconds(DateTime.now().toMillis());
            return { mostRecentTodoId: newId };
          });
        },
        todoCreatedAtMilliseconds: 0,
        setTodoCreatedAtMilliseconds: (newCreatedAt) => {
          set(() => {
            return { todoCreatedAtMilliseconds: newCreatedAt };
          });
        },
      }),

      {
        name: "mostRecentTodo-storage",
      }
    )
  )
);

export default useMostRecentTodoIdStore;
