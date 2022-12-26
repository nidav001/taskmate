import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import { type Todo } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import useColumnStore from "../../hooks/columnStore";
import { panel } from "../../styles/transitionClasses";
import { type Day } from "../../types/enums";
import { sortTodos } from "../../utils/todoUtils";
import TodoCard from "../shared/todoCard";
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

export default function DroppableDayArea({
  day,
  todos,
  searchValue,
  refetch,
  isLoading,
  date,
}: DroppableDayAreaProps) {
  const [disclosureOpen, setDisclosureOpen] = useState(false);
  const [dayModified, setDayModified] = useState(false);

  useEffect(() => {
    if (searchValue !== "" && getFilteredAndSortedTodos.length > 0) {
      setDisclosureOpen(true);
    } else {
      const open = checkIfDisclosureShouldBeOpen();
      setDisclosureOpen(open);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const todoOrder =
    useColumnStore((state) => state.columns).find((col) => col.id === day)
      ?.todoOrder ?? [];

  const currentDate = <p>{date.toLocaleString().toString()}</p>;

  function handleDisclosureButtonClick() {
    setDisclosureOpen(!disclosureOpen);
    setDayModified(true);
  }

  function checkIfDisclosureShouldBeOpen() {
    //Skip if day is manually modified
    let returnValue = disclosureOpen;
    if (dayModified) return returnValue;

    //Create conditions for disclosure to be open
    const dateIsString = typeof date === "string";
    let dateIsBiggerOrEqualsToday = false;
    if (!dateIsString) {
      dateIsBiggerOrEqualsToday =
        date.startOf("day") >= DateTime.now().startOf("day");
    }

    //Check if conditions are met
    if (!dateIsString && !dateIsBiggerOrEqualsToday) {
      returnValue = false;
    } else if ((!dateIsString && dateIsBiggerOrEqualsToday) || dateIsString) {
      returnValue = true;
    }
    return returnValue;
  }

  const DayAreaHeader = (
    <Disclosure.Button
      className="w-80 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
      onClick={() => handleDisclosureButtonClick()}
    >
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
          <div>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`h-5 transition-all dark:text-white ${
                disclosureOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>
      </div>
    </Disclosure.Button>
  );

  const getFilteredAndSortedTodos = (): Todo[] => {
    const filteredTodos = todos?.filter((todo) =>
      todo.content.toLowerCase().includes(searchValue.toLowerCase())
    );

    return sortTodos(filteredTodos, todoOrder);
  };

  return (
    <Droppable
      droppableId={day}
      renderClone={(provided, snapshot, rubric) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const todo = getFilteredAndSortedTodos()[rubric.source.index]!;
        return (
          <TodoCard
            isDragging={true}
            provided={provided}
            todo={todo}
            todoDone={todo.done}
          />
        );
      }}
    >
      {(provided) => (
        <div
          className="flex w-80 flex-col py-4"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <Disclosure>
            <div className="w-80">
              {DayAreaHeader}
              <Transition
                className={!disclosureOpen ? "overflow-hidden" : ""}
                show={disclosureOpen}
                {...panel}
              >
                <Disclosure.Panel static>
                  {isLoading
                    ? todoLoadingSkeleton
                    : getFilteredAndSortedTodos().map((todo, index) => {
                        return (
                          <DraggableTodoCard
                            key={todo.id}
                            disclosureOpen={disclosureOpen}
                            refetch={refetch}
                            index={index}
                            todo={todo}
                          />
                        );
                      })}

                  {provided.placeholder}
                </Disclosure.Panel>
              </Transition>
            </div>
          </Disclosure>
        </div>
      )}
    </Droppable>
  );
}
