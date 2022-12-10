import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Info } from "luxon";

type DayComboboxProps = {
  selected: string;
  setSelected: (day: string) => void;
  setValue: (name: "day" | "content", value: string) => void;
};

const weekdays = Info.weekdays("long");

const DayCombobox: React.FC<DayComboboxProps> = ({
  selected,
  setSelected,
  setValue,
}) => {
  return (
    <Listbox
      value={selected}
      onChange={(val: string) => {
        setSelected(val);
        setValue("day", val);
      }}
    >
      <Listbox.Button className="relative w-full cursor-default rounded-xl bg-white p-3 pr-10 text-left shadow-md">
        <span className="block truncate">{selected}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Listbox.Options className="flex w-full flex-col items-start rounded-lg border bg-newGray2">
        {weekdays.map((day) => (
          <Listbox.Option
            className="w-full p-2 hover:bg-laccent"
            key={day}
            value={day}
          >
            {day}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default DayCombobox;
