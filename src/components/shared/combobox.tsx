import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { Fragment, useState } from "react";
import { inputStyle } from "../../styles/basicStyles";

type ComboboxProps = {
  selected: string;
  setSelected: (selectedValue: string) => void;
  addCollaborator: (email: string) => void;
  comboboxOptions: string[];
};

export default function ComboboxNew({
  selected,
  setSelected,
  addCollaborator,
  comboboxOptions,
}: ComboboxProps) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? comboboxOptions
      : comboboxOptions.filter((option) =>
          option
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  function handleNewCollaboratorAdded() {
    addCollaborator(query);
  }

  function onKeyboardHandler(e: KeyboardEvent) {
    if (e && e.key === "Enter" && filteredOptions.length === 0) {
      handleNewCollaboratorAdded();
    }
  }

  return (
    <Combobox
      as="div"
      className="relative w-full max-w-sm"
      value={selected}
      onChange={setSelected}
    >
      <div className="relative">
        <Combobox.Input
          onKeyDown={(e) => onKeyboardHandler(e)}
          className={classNames(inputStyle, "w-full")}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredOptions.length === 0 && query !== "" ? (
            <button
              onClick={() => handleNewCollaboratorAdded()}
              className="w-full bg-teal-600 py-2 px-4 text-left text-white"
              type="button"
            >
              {query} hinzufügen
            </button>
          ) : (
            filteredOptions.map((option) => (
              <Combobox.Option
                key={option}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-teal-600 text-white" : "text-gray-900"
                  }`
                }
                value={option}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-teal-600"
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
