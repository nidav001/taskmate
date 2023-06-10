import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { Fragment } from "react";
import {
  comboboxOptionActive,
  comboboxOptionBase,
  comboboxOptionsStyle,
  inputStyle,
} from "../../styles/basicStyles";
import { dropdown } from "../../styles/transitionClasses";

type GenericComboboxProps<T> = {
  selected: T;
  setSelected: (selectedValue: T) => void;
  setValue?: (name: "day" | "sharedWithEmail", value: T) => void;
  formValueType?: "day" | "sharedWithEmail";
  comboboxOptions: T[];
  show: boolean;
  sharedView: boolean;
};

export default function GenericCombobox<T extends string>({
  selected,
  setSelected,
  setValue,
  comboboxOptions,
  show,
  sharedView,
  formValueType,
}: GenericComboboxProps<T>) {
  return (
    <Combobox
      as="div"
      className={classNames(
        "max-w-sm",
        sharedView ? "w-1/2" : "w-80",
        show ? "" : "hidden"
      )}
      value={selected}
      onChange={(val: T) => {
        setSelected(val);
        if (setValue && formValueType) setValue(formValueType, val);
      }}
    >
      <Combobox.Button
        className={classNames(
          inputStyle,
          "relative h-14 w-full cursor-pointer pr-10 text-left"
        )}
        placeholder="Select an option"
      >
        <span className="block truncate dark:text-white">{selected}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Combobox.Button>
      <Transition as={Fragment} {...dropdown}>
        <Combobox.Options className={comboboxOptionsStyle}>
          {comboboxOptions.map((key) => (
            <Combobox.Option
              className={({ active }) =>
                classNames(
                  comboboxOptionBase,
                  active ? comboboxOptionActive : ""
                )
              }
              key={key}
              value={key}
            >
              {key}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
