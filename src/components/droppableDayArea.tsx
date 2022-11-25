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
  const { todoOrder } = useTodoOrderStore();

  return (
    <Droppable key={day} droppableId={day}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="w-80"
        >
          <h1 className="text-xl font-bold">{day}</h1>
          <div className="flex flex-col py-4">
            {todos
              ?.filter(
                (todo) =>
                  todo.day === day &&
                  todo.content.toLowerCase().includes(searchValue.toLowerCase())
              )

              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .sort((a, b) => (a.done === b.done ? 0 : b.done ? -1 : 1))
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
