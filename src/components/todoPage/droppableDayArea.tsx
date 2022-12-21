import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import { type Todo } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import useDisclosureStore from "../../hooks/disclosureStore";
import useTodoOrderStore from "../../hooks/todoOrderStore";
import { panel } from "../../styles/transitionClasses";
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
  const { days, setDay, resetDay } = useDisclosureStore();

  const [disclosureOpen, setDisclosureOpen] = useState(false);

  const dayForDisclosure = days.find((d) => d.day === day)!;

  useEffect(() => {
    setDisclosureOpen(dayForDisclosure.open);
  }, [todos, days]);

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

  useEffect(() => {
    resetDay(day);
  }, []);

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

  const DayAreaHeader = (
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
            <div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`h-5 transition-all dark:text-white ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </Disclosure.Button>
  );

  const filteredTodos = todos
    ?.filter((todo) =>
      todo.content.toLowerCase().includes(searchValue.toLowerCase())
    )

    .sort((a, b) => {
      const aIndex = todoOrder.findIndex((todo) => todo.id === a.id);
      const bIndex = todoOrder.findIndex((todo) => todo.id === b.id);
      return aIndex - bIndex;
    });

  //Using day + disclosureOpen in Droppable key to force rerender when disclosureOpen changes
  return (
    // <Droppable key={day + disclosureOpen} droppableId={day}>
    //   {(provided) => (
    //     <>
    //       <Disclosure defaultOpen={disclosureOpen}>
    //         {({ open }) => (
    //           <div className="w-80">
    //             {DroppableDayAreaHeader}
    //             <div
    //               className="flex w-80 flex-col py-4"
    //               ref={provided.innerRef}
    //               {...provided.droppableProps}
    //             >
    //               {isLoading
    //                 ? todoLoadingSkeleton
    //                 : todos
    //                     ?.filter((todo) =>
    //                       todo.content
    //                         .toLowerCase()
    //                         .includes(searchValue.toLowerCase())
    //                     )

    //                     .sort((a, b) => {
    //                       const aIndex = todoOrder.findIndex(
    //                         (todo) => todo.id === a.id
    //                       );
    //                       const bIndex = todoOrder.findIndex(
    //                         (todo) => todo.id === b.id
    //                       );
    //                       return aIndex - bIndex;
    //                     })

    //                     .map((todo, index) => (
    //                       <Transition
    //                         appear
    //                         key={todo.id}
    //                         show={open}
    //                         {...disclosurepanel}
    //                       >
    //                         <Disclosure.Panel static>
    //                           <DraggableTodoCard
    //                             disclosureOpen={open}
    //                             refetch={refetch}
    //                             index={index}
    //                             todo={todo}
    //                           />
    //                         </Disclosure.Panel>
    //                       </Transition>
    //                     ))}
    //               {provided.placeholder}
    //             </div>
    //           </div>
    //         )}
    //       </Disclosure>
    //     </>
    //   )}
    // </Droppable>

    <Disclosure defaultOpen={disclosureOpen}>
      {({ open }) => (
        <div className="w-80">
          {DayAreaHeader}
          <Transition className="overflow-hidden" show={open}>
            <Transition.Child {...panel}>
              <Disclosure.Panel static>
                <Droppable key={day + disclosureOpen} droppableId={day}>
                  {(provided) => (
                    <div
                      className="flex w-80 flex-col py-4"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {isLoading
                        ? todoLoadingSkeleton
                        : filteredTodos.map((todo, index) => (
                            <DraggableTodoCard
                              key={todo.id}
                              disclosureOpen={open}
                              refetch={refetch}
                              index={index}
                              todo={todo}
                            />
                          ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Disclosure.Panel>
            </Transition.Child>
          </Transition>
        </div>
      )}
    </Disclosure>
  );
}

export default DroppableDayArea;
