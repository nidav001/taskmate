import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Day } from "../types/enums";

type DayOpen = {
  day: Day;
  open: boolean;
  modified: boolean;
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
          { day: Day.Allgemein, open: true, modified: false },
          { day: Day.Montag, open: true, modified: false },
          { day: Day.Dienstag, open: true, modified: false },
          { day: Day.Mittwoch, open: true, modified: false },
          { day: Day.Donnerstag, open: true, modified: false },
          { day: Day.Freitag, open: true, modified: false },
          { day: Day.Samstag, open: true, modified: false },
          { day: Day.Sonntag, open: true, modified: false },
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
