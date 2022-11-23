import { Droppable } from "react-beautiful-dnd";
import DraggableTodoCard from "../components/draggableTodoCard";

//!NOT WORKING AS COMPONENT IN OTHER FILE
const DroppableDayArea: React.FC<{
  day: string;
  todos: any;
  searchValue: string;
}> = ({ day, todos, searchValue }) => {
  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "",
    width: 250,
  });

  return (
    <Droppable key={day} droppableId={day}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getListStyle(snapshot.isDraggingOver)}
          className="w-full"
        >
          <h1 className="text-xl font-bold">{day}</h1>
          <div className="flex w-full flex-col items-center gap-2 py-4">
            {todos?.data
              ?.filter(
                (todo) =>
                  todo.day === day &&
                  todo.content.toLowerCase().includes(searchValue.toLowerCase())
              )
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .sort((a, b) => (a.done === b.done ? 0 : a.done ? -1 : 1))
              .map((todo, index) => (
                <DraggableTodoCard index={index} key={todo.id} todo={todo} />
              ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default DroppableDayArea;
