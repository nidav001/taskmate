import { type Todo } from "@prisma/client";
import { Draggable } from "react-beautiful-dnd";
import TodoCard from "../shared/todoCard";

type DraggableTodoCardProps = {
  todo: Todo;
  index: number;
  refetch: () => void;
  disclosureOpen: boolean;
};

export default function DraggableTodoCard({
  todo,
  index,
  refetch,
  disclosureOpen,
}: DraggableTodoCardProps) {
  return (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided, snapshot) => {
        return (
          <TodoCard
            restore={false}
            provided={provided}
            isDragging={snapshot.isDragging}
            disclosureOpen={disclosureOpen}
            todo={todo}
            refetch={refetch}
          />
        );
      }}
    </Draggable>
  );
}
