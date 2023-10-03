import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DarkModeState {
  dark: boolean;
  setDark: () => void;
}

const useDarkModeStore = create<DarkModeState>()(
  devtools(
    persist(
      (set) => ({
        dark: false,
        setDark: () => set((state) => ({ dark: !state.dark })),
      }),
      {
        name: "darkmode-storage-v1",
      },
    ),
  ),
);

export default useDarkModeStore;
