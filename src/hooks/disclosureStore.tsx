import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Day } from "../types/enums";

type DayOpen = {
  day: Day;
  open: boolean;
};

interface DisclosureState {
  Days: DayOpen[];
  setDay: (day: DayOpen) => void;
}

const useDisclosureStore = create<DisclosureState>()(
  devtools(
    persist(
      (set) => ({
        Days: [
          { day: Day.Allgemein, open: true },
          { day: Day.Montag, open: true },
          { day: Day.Dienstag, open: true },
          { day: Day.Mittwoch, open: true },
          { day: Day.Donnerstag, open: true },
          { day: Day.Freitag, open: true },
          { day: Day.Samstag, open: true },
          { day: Day.Sonntag, open: true },
        ],
        setDay: (day) =>
          set((state) => ({
            Days: state.Days.map((d) => (d.day === day.day ? day : d)),
          })),
      }),

      {
        name: "disclosure-storage2",
      }
    )
  )
);

export default useDisclosureStore;
