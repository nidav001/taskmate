import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MostRecentTodoIdState {
  mostRecentTodoId: string;
  setMostRecentTodoId: (newId: string) => void;
  todoCreatedAt: number;
  setTodoCreatedAt: (newDate: 0) => void;
}

const useMostRecentTodoIdStore = create<MostRecentTodoIdState>()(
  devtools(
    persist(
      (set) => ({
        mostRecentTodoId: "",
        setMostRecentTodoId: (newId) => {
          set(() => {
            return { mostRecentTodoId: newId };
          });
        },
        todoCreatedAt: 0,
        setTodoCreatedAt: (newDate) => {
          set(() => {
            return { todoCreatedAt: newDate };
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
