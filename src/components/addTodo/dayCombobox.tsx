import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { inputStyle } from "../../styles/buttonStyle";
import { dropdown } from "../../styles/transitionClasses";
import { Day } from "../../types/enums";

type DayComboboxProps = {
  selected: Day;
  setSelected: (day: Day) => void;
  setValue: (name: "day" | "content", value: Day) => void;
};

function DayCombobox({ selected, setSelected, setValue }: DayComboboxProps) {
  return (
    <Listbox
      as={"div"}
      className="w-80"
      value={selected}
      onChange={(val: Day) => {
        setSelected(val);
        setValue("day", val);
      }}
    >
      <Listbox.Button
        className={
          inputStyle + " relative w-full cursor-default pr-10 text-left"
        }
      >
        <span className="block truncate dark:text-white">{selected}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Transition as={Fragment} {...dropdown}>
        <Listbox.Options className="mt-1 flex w-full flex-col items-start rounded-lg bg-gray-100 py-1 dark:bg-slate-700">
          {(Object.keys(Day) as Array<keyof typeof Day>).map((key) => (
            <Listbox.Option
              className={({ active }) =>
                `relative w-full cursor-default select-none py-2 pl-10 pr-4 dark:text-white ${
                  active
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-500 dark:text-blue-100"
                    : ""
                }`
              }
              key={key}
              value={key}
            >
              {key}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}

export default DayCombobox;
