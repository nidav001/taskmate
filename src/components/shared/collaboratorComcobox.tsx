import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import useViewStore from "../../hooks/viewStore";
import { inputStyle } from "../../styles/basicStyles";
import { getCollaboratorEmails } from "../../utils/todoUtils";
import { trpc } from "../../utils/trpc";

type ComboboxProps = {
  setValueInForm?: (fieldName: string, value: string) => void;
  canAddEmail?: boolean;
};

export default function CollaboratorCombobox({
  setValueInForm,
  canAddEmail,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const { currentCollaborator, setCurrentCollaborator } = useViewStore();
  const session = useSession();
  const collaboratorEmailsFromDb = getCollaboratorEmails(
    trpc,
    session.data?.user?.email ?? ""
  );

  const [collaboratorEmails, setCollaboratorEmails] = useState<string[]>(
    collaboratorEmailsFromDb
  );

  useEffect(() => {
    // setCurrentCollaborator("");
    // setCollaboratorEmails(collaboratorEmailsFromDb);
  }, []);

  const filteredEmails =
    query === ""
      ? collaboratorEmails
      : collaboratorEmails.filter((email) =>
          email
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  function isQueryValidEmail() {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(query);
  }

  function handleNewCollaboratorAdded() {
    if (canAddEmail && isQueryValidEmail()) {
      if (setValueInForm) setValueInForm("sharedWithEmail", query);

      setCurrentCollaborator(query);
      setCollaboratorEmails([...collaboratorEmails, query]);
    }
  }

  function onKeyboardHandler(e: KeyboardEvent) {
    if (e && e.key === "Enter" && filteredEmails.length === 0) {
      handleNewCollaboratorAdded();
    }
  }

  const RegularOptions = filteredEmails.map((email) => (
    <Combobox.Option
      key={email}
      className={({ active }) =>
        `relative cursor-default select-none py-2 pl-10 pr-4 ${
          active ? "bg-teal-600 text-white" : "text-gray-900"
        }`
      }
      value={email}
    >
      {({ selected, active }) => (
        <>
          <span
            className={`block truncate ${
              selected ? "font-medium" : "font-normal"
            }`}
          >
            {email}
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
  ));

  const NothingFound = (
    <div className="w-full py-2 px-4 text-left text-black">Nicht gefunden.</div>
  );

  const AddCollaboratorButton = (
    <button
      onClick={() => handleNewCollaboratorAdded()}
      className="w-full bg-teal-600 py-2 px-4 text-left text-white"
      type="button"
    >
      {isQueryValidEmail()
        ? `${query} hinzufügen`
        : `${query} ist keine gültige E-Mail`}
    </button>
  );

  return (
    <Combobox
      as="div"
      className="relative w-full max-w-sm"
      value={currentCollaborator}
      onChange={setCurrentCollaborator}
    >
      <div className="relative">
        <Combobox.Input
          onKeyDown={(e) => onKeyboardHandler(e)}
          onBlur={() => handleNewCollaboratorAdded()}
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
          {filteredEmails.length === 0 && query !== ""
            ? canAddEmail
              ? AddCollaboratorButton
              : NothingFound
            : RegularOptions}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
