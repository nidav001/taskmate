import { type Todo } from "@prisma/client";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import classNames from "../utils/classNames";
import { trpc } from "../utils/trpc";

const DraggableTodoCard: React.FC<{
  todo: Todo;
  index: number;
  refetch: () => void;
}> = ({ todo, index, refetch }) => {
  const [todoDone, setTodoDoneState] = useState<boolean>(todo.done);

  const setTodoDone = trpc.todo.setTodoDone.useMutation({
    onSuccess: () => {
      setTodoDoneState(!todoDone);
      refetch();
    },
  });

  return (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          className="m-2 w-full select-none"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <div className="flex flex-col rounded-xl bg-dark/10 p-4 text-black hover:bg-dark/20">
            <div className="flex items-center justify-between">
              <div
                className={classNames(
                  todo.done ? "line-through" : "",
                  "w-96 text-lg"
                )}
              >
                {todo.content}
              </div>
              <input
                type="checkbox"
                checked={todoDone}
                onChange={() =>
                  setTodoDone.mutate({ id: todo.id, done: !todo.done })
                }
                className="h-6 w-6 rounded-full"
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableTodoCard;
