import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Day } from "../types/enums";

type DayOpen = {
  day: Day;
  open: boolean;
  modified: boolean;
};

interface DisclosureState {
  days: DayOpen[];
  setDay: (day: DayOpen) => void;
  resetDay: (day: Day) => void;
}

const initialDays: DayOpen[] = [
  { day: Day.Allgemein, open: true, modified: false },
  { day: Day.Montag, open: true, modified: false },
  { day: Day.Dienstag, open: true, modified: false },
  { day: Day.Mittwoch, open: true, modified: false },
  { day: Day.Donnerstag, open: true, modified: false },
  { day: Day.Freitag, open: true, modified: false },
  { day: Day.Samstag, open: true, modified: false },
  { day: Day.Sonntag, open: true, modified: false },
];

const useDisclosureStore = create<DisclosureState>()(
  devtools(
    persist(
      (set) => ({
        days: initialDays,
        setDay: (day) =>
          set((state) => ({
            days: state.days.map((d) => (d.day === day.day ? day : d)),
          })),
        resetDay: (day) =>
          set((state) => ({
            days: state.days.map((d) => {
              if (d.day === day) {
                return { day: d.day, open: true, modified: false };
              }
              return d;
            }),
          })),
      }),

      {
        name: "disclosure-storage18",
      }
    )
  )
);

export default useDisclosureStore;
