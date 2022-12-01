import { type Todo } from "@prisma/client";
import { Droppable } from "react-beautiful-dnd";
import useTodoOrderStore from "../../hooks/todoOrderStore";
import DraggableTodoCard from "./draggableTodoCard";

const DroppableDayArea: React.FC<{
  day: string;
  todos: Todo[];
  searchValue: string;
  refetch: () => void;
  isLoading: boolean;
}> = ({ day, todos, searchValue, refetch, isLoading }) => {
  const loadingSkeleton = (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="mb-2.5 h-2 max-w-[300px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 max-w-[240px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 max-w-[270px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  const todoOrder =
    useTodoOrderStore((state) => state.columns).find((col) => col.id === day)
      ?.todoOrder ?? [];

  return (
    <Droppable key={day} droppableId={day}>
      {(provided) => (
        <>
          <div className="w-80">
            <h1 className="w-full text-xl font-bold md:text-center">{day}</h1>
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
