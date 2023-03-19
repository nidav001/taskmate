import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import useViewStore from "../../hooks/viewStore";
import {
  comboboxOptionActive,
  comboboxOptionBase,
  comboboxOptionsStyle,
  inputStyle,
} from "../../styles/basicStyles";
import { dropdown } from "../../styles/transitionClasses";
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
  const {
    currentCollaborator,
    setCurrentCollaborator,
    collaboratorEmails,
    setCollaboratorEmails,
  } = useViewStore();

  const session = useSession();

  const emailQuery = trpc.todo.getCollaborators.useQuery();

  const emailQueryData = useMemo(
    () => emailQuery.data ?? [],
    [emailQuery.data]
  );

  const collaboratorEmailsFromDb = useMemo(
    () =>
      getCollaboratorEmails(emailQueryData, session.data?.user?.email ?? ""),
    [emailQueryData]
  );

  useEffect(() => {
    setCollaboratorEmails(collaboratorEmailsFromDb);
  }, []);

  useEffect(() => {
    if (collaboratorEmailsFromDb.length > 0) {
      setCollaboratorEmails(collaboratorEmailsFromDb);
    }
  }, [currentCollaborator]);

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
    <Transition key={email} as={Fragment} {...dropdown}>
      <Combobox.Option
        className={({ active }) =>
          classNames(comboboxOptionBase, active ? comboboxOptionActive : "")
        }
        value={email}
      >
        {({ selected }) => (
          <span
            className={`block truncate ${
              selected ? "font-medium" : "font-normal"
            }`}
          >
            {email}
          </span>
        )}
      </Combobox.Option>
    </Transition>
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

  function getOptions() {
    if (filteredEmails.length === 0) {
      if (query !== "") {
        if (canAddEmail) {
          return AddCollaboratorButton;
        }
      }
      return NothingFound;
    }
    return RegularOptions;
  }

  return (
    <Combobox
      disabled={collaboratorEmails.length === 0 && !canAddEmail}
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
        <Combobox.Options className={comboboxOptionsStyle}>
          {getOptions()}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
