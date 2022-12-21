import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import { type Todo } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import useDisclosureStore from "../../hooks/disclosureStore";
import useTodoOrderStore from "../../hooks/todoOrderStore";
import { type Day } from "../../types/enums";
import DraggableTodoCard from "./draggableTodoCard";

type DroppableDayAreaProps = {
  day: Day;
  todos: Todo[];
  searchValue: string;
  refetch: () => void;
  date: DateTime | string;
  isLoading: boolean;
};

const todoLoadingSkeleton = (
  <div role="status" className="max-w-sm animate-pulse">
    <div className="mb-2.5 h-2 max-w-[300px] rounded-full bg-gray-400"></div>
    <div className="mb-2.5 h-2 max-w-[240px] rounded-full bg-gray-400 "></div>
    <div className="mb-2.5 h-2 max-w-[270px] rounded-full bg-gray-400"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

function DroppableDayArea({
  day,
  todos,
  searchValue,
  refetch,
  isLoading,
  date,
}: DroppableDayAreaProps) {
  const { Days, setDay } = useDisclosureStore();

  const [disclosureOpen, setDisclosureOpen] = useState(false);

  const dayForDisclosure = Days.find((d) => d.day === day)!;

  useEffect(() => {
    setDisclosureOpen(dayForDisclosure.open);
  }, [todos, Days]);

  const todoOrder =
    useTodoOrderStore((state) => state.columns).find((col) => col.id === day)
      ?.todoOrder ?? [];

  const currentDate = <p>{date.toLocaleString()}</p>;

  function handleDisclosureButtonClick() {
    setDay({
      day: day,
      open: !disclosureOpen,
      modified: true,
    });
  }

  function checkIfDisclosureShouldBeOpen() {
    //Skip if day is manually modified
    if (!dayForDisclosure.modified) {
      //Create conditions for disclosure to be open
      const dateIsString = typeof date === "string";
      const todosAreFilled = todos.length > 0;
      let dateIsBiggerOrEqualsToday = false;
      if (!dateIsString) {
        dateIsBiggerOrEqualsToday =
          date.startOf("day") >= DateTime.now().startOf("day");
      }

      //Check if conditions are met
      if (!todosAreFilled || (!dateIsString && !dateIsBiggerOrEqualsToday)) {
        return false;
      } else if (
        (todosAreFilled && !dateIsString && dateIsBiggerOrEqualsToday) ||
        dateIsString
      ) {
        return true;
      }
    }
    return null;
  }

  useEffect(() => {
    const open = checkIfDisclosureShouldBeOpen();
    if (open !== null) {
      setDay({
        day: day,
        open: open,
        modified: false,
      });
    }
  }, [todos]);

  const DroppableDayAreaHeader = (
    <Disclosure.Button
      className="w-80 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
      onClick={() => handleDisclosureButtonClick()}
    >
      {({ open }) => (
        <div className="flex flex-row items-center">
          <div className="flex w-full flex-col justify-evenly">
            <h1 className="text-xl font-bold dark:text-white">{day}</h1>
            <div className="text-slate-400">{currentDate}</div>
          </div>
          <div className="flex flex-col">
            <div
              className={`flex h-6 w-6 items-center justify-evenly rounded-full bg-gray-200 text-sm font-bold text-black dark:bg-white ${
                isLoading ? "animate-pulse bg-gray-400" : ""
              }`}
            >
              {isLoading ? null : todos.length}
            </div>
            <FontAwesomeIcon
              icon={open ? faChevronUp : faChevronDown}
              className="h-5 dark:text-white"
            />
          </div>
        </div>
      )}
    </Disclosure.Button>
  );

  //Using day + disclosureOpen in Droppable key to force rerender when disclosureOpen changes
  return (
    <Droppable key={day + disclosureOpen} droppableId={day}>
      {(provided) => (
        <>
          <Disclosure defaultOpen={disclosureOpen}>
            <div className="w-80">
              {DroppableDayAreaHeader}

              <div
                className="flex w-80 flex-col py-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {isLoading
                  ? todoLoadingSkeleton
                  : todos
                      ?.filter((todo) =>
                        todo.content
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )

                      .sort((a, b) => {
                        const aIndex = todoOrder.findIndex(
                          (todo) => todo.id === a.id
                        );
                        const bIndex = todoOrder.findIndex(
                          (todo) => todo.id === b.id
                        );
                        return aIndex - bIndex;
                      })

                      .map((todo, index) => (
                        // <Transition
                        //   key={todo.id}
                        //   show={disclosureOpen}
                        //   enter="transform transition duration-[400ms]"
                        //   enterFrom="opacity-0 rotate-[-120deg] scale-50"
                        //   enterTo="opacity-100 rotate-0 scale-100"
                        //   leave="transform duration-200 transition ease-in-out"
                        //   leaveFrom="opacity-100 rotate-0 scale-100 "
                        //   leaveTo="opacity-0 scale-95 "
                        // >
                        <Disclosure.Panel key={todo.id}>
                          <DraggableTodoCard
                            refetch={refetch}
                            index={index}
                            todo={todo}
                          />
                        </Disclosure.Panel>
                        // </Transition>
                      ))}
                {provided.placeholder}
              </div>
            </div>
          </Disclosure>
        </>
      )}
    </Droppable>
  );
}

export default DroppableDayArea;
