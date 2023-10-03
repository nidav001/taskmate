import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SearchState {
  search: string;
  setSearch: (search: string) => void;
}

const useSearchStore = create<SearchState>()(
  devtools(
    persist(
      (set) => ({
        search: "",
        setSearch: (search) => set(() => ({ search })),
      }),

      {
        name: "search-storage",
      },
    ),
  ),
);

export default useSearchStore;
