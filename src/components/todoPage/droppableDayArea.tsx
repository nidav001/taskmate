import { type Todo } from "@prisma/client";
import { Info } from "luxon";
import { Droppable } from "react-beautiful-dnd";
import useTodoOrderStore from "../../hooks/todoOrderStore";
import DraggableTodoCard from "./draggableTodoCard";

type DroppableDayAreaProps = {
  dayNumber: number;
  todos: Todo[];
  searchValue: string;
  refetch: () => void;
  date: string;
  isLoading: boolean;
};

const DroppableDayArea: React.FC<DroppableDayAreaProps> = ({
  dayNumber,
  todos,
  searchValue,
  refetch,
  isLoading,
  date,
}) => {
  const day = Info.weekdays("long")[dayNumber - 1];

  const loadingSkeleton = (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="mb-2.5 h-2 max-w-[300px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 max-w-[240px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 max-w-[270px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  const todoOrder =
    useTodoOrderStore((state) => state.columns).find(
      (col) => col.id === dayNumber
    )?.todoOrder ?? [];

  const currentDate = <p>{date}</p>;

  return (
    <Droppable key={dayNumber} droppableId={dayNumber.toString()}>
      {(provided) => (
        <>
          <div className="w-80">
            <div className="flex w-full flex-col items-center justify-evenly">
              <h1 className="text-xl font-bold ">{day}</h1>
              {currentDate}
            </div>
            <div
              className="flex flex-col py-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {isLoading
                ? loadingSkeleton
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
                      <DraggableTodoCard
                        refetch={refetch}
                        index={index}
                        key={todo.id}
                        todo={todo}
                      />
                    ))}
              {provided.placeholder}
            </div>
          </div>
        </>
      )}
    </Droppable>
  );
};

export default DroppableDayArea;
