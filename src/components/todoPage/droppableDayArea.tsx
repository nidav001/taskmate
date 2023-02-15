import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import { type Todo } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import useColumnStore from "../../hooks/columnStore";
import useViewStore from "../../hooks/viewStore";
import { panel } from "../../styles/transitionClasses";
import { Day } from "../../types/enums";
import { sortTodos } from "../../utils/todoUtils";
import TodoCard from "../shared/todoCard";
import DraggableTodoCard from "./draggableTodoCard";

type DroppableDayAreaProps = {
  day: Day;
  todos: Todo[];
  searchValue: string;
  refetch: () => void;
  date: DateTime;
  isLoading: boolean;
};

const todoLoadingSkeleton = (
  <div role="status" className="max-w-sm animate-pulse">
    <div className="mb-2.5 h-2 max-w-[300px] rounded-full bg-gray-400" />
    <div className="mb-2.5 h-2 max-w-[240px] rounded-full bg-gray-400 " />
    <div className="mb-2.5 h-2 max-w-[270px] rounded-full bg-gray-400" />
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
  const { regularColumns, sharedColumns } = useColumnStore();
  const columns = useViewStore().view ? sharedColumns : regularColumns;

  const shouldDisclosureBeOpen =
    date.startOf("day") >= DateTime.now().startOf("day");
  const [disclosureOpen, setDisclosureOpen] = useState(shouldDisclosureBeOpen);

  const todoOrder = columns.find((col) => col.id === day)?.todoOrder ?? [];

  const filteredAndSortedTodos = () => {
    const filteredTodos = todos?.filter((todo) =>
      todo.content.toLowerCase().includes(searchValue.toLowerCase())
    );

    return sortTodos(filteredTodos, todoOrder);
  };

  useEffect(() => {
    // console.log(shouldDisclosureBeOpen);
    if (searchValue !== "" && filteredAndSortedTodos().length > 0) {
      setDisclosureOpen(true);
    } else {
      setDisclosureOpen(shouldDisclosureBeOpen);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const currentDate = () => {
    return day !== Day.Allgemein ? (
      <p>{date.setLocale("de-DE").toLocaleString()}</p>
    ) : (
      `Woche ${DateTime.now().weekNumber.toString()}`
    );
  };

  const DayAreaHeader = (
    <Disclosure.Button
      className="w-80 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
      onClick={() => setDisclosureOpen(!disclosureOpen)}
    >
      <div className="flex flex-row items-center">
        <div className="flex w-full flex-col justify-evenly">
          <h1 className="text-xl font-bold dark:text-white">{day}</h1>
          <div className="text-slate-400">{currentDate()}</div>
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

  return (
    <Disclosure>
      <div className="w-80">
        {DayAreaHeader}
        <Transition
          className={!disclosureOpen ? "overflow-hidden" : ""}
          show={disclosureOpen}
          {...panel}
        >
          <Disclosure.Panel static>
            <Droppable
              droppableId={day}
              renderClone={(provided, snapshot, rubric) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const todo = filteredAndSortedTodos()[rubric.source.index]!;
                return (
                  <TodoCard
                    isDragging
                    provided={provided}
                    todo={todo}
                    restore={false}
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
                  {isLoading
                    ? todoLoadingSkeleton
                    : filteredAndSortedTodos().map((todo, index) => {
                        return (
                          <DraggableTodoCard
                            key={todo.id}
                            refetch={refetch}
                            index={index}
                            todo={todo}
                          />
                        );
                      })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Disclosure.Panel>
        </Transition>
      </div>
    </Disclosure>
  );
}
