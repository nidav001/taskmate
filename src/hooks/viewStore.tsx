import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { View } from "../types/enums";

interface ViewState {
  view: View;
  setView: (newView: View) => void;
}

const useViewStore = create<ViewState>()(
  devtools(
    persist(
      (set) => ({
        view: View.Regular,
        setView: (newView) => {
          set(() => {
            return { view: newView };
          });
        },
      }),
      {
        name: "view-storage-v1",
      }
    )
  )
);

export default useViewStore;
