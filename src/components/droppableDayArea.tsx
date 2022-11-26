import { type Todo } from "@prisma/client";
import { Droppable } from "react-beautiful-dnd";
import DraggableTodoCard from "../components/draggableTodoCard";
import useTodoOrderStore from "../hooks/todoOrderStore";

const DroppableDayArea: React.FC<{
  day: string;
  todos: Todo[];
  searchValue: string;
  refetch: () => void;
}> = ({ day, todos, searchValue, refetch }) => {
  const todoOrder =
    useTodoOrderStore((state) => state.columns).find((col) => col.id === day)
      ?.todoOrder ?? [];

  return (
    <Droppable key={day} droppableId={day}>
      {(provided) => (
        <div className="w-80">
          <h1 className="text-xl font-bold">{day}</h1>
          <div
            className="flex flex-col py-4"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {todos
              ?.filter((todo) =>
                todo.content.toLowerCase().includes(searchValue.toLowerCase())
              )

              .sort((a, b) => todoOrder.indexOf(a.id) - todoOrder.indexOf(b.id))
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
      )}
    </Droppable>
  );
};

export default DroppableDayArea;
