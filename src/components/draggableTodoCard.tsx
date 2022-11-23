import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import classNames from "../utils/classNames";
import { trpc } from "../utils/trpc";
import useLongPress from "../utils/useLongPress";

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

  const onLongPress = () => {
    console.log("longpress is triggered");
  };

  const onClick = () => {
    console.log("click is triggered");
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };

  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          {...longPressEvent}
          className="m-2 w-full select-none"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <div className="flex flex-col rounded-xl bg-dark/10 p-4 text-black hover:bg-dark/20">
            <div className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={todoDone}
                onChange={() =>
                  setTodoDone.mutate({ id: todo.id, done: !todo.done })
                }
                className="h-6 w-6 rounded-full"
              />
              <div
                className={classNames(
                  todo.done ? "line-through" : "",
                  "w-96 text-lg"
                )}
              >
                {todo.content}
              </div>
              <EllipsisVerticalIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableTodoCard;
