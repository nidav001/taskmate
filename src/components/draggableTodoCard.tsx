import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import useMarkedTodoStore from "../hoooks/markedTodoStore";
import classNames from "../utils/classNames";
import { trpc } from "../utils/trpc";
import useLongPress from "../utils/useLongPress";

const DraggableTodoCard: React.FC<{
  todo: Todo;
  index: number;
  refetch: () => void;
}> = ({ todo, index, refetch }) => {
  const [todoDone, setTodoDoneState] = useState<boolean>(todo.done);

  const markedTodoStore = useMarkedTodoStore();

  const setTodoDone = trpc.todo.setTodoDone.useMutation({
    onSuccess: () => {
      setTodoDoneState(!todoDone);
      refetch();
    },
  });

  const setTodoContent = trpc.todo.updateTodoContent.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const isMarked = markedTodoStore.markedTodos.includes(todo);

  const onLongPress = () => {
    console.log("longpress is triggered");
    if (!isMarked) {
      markedTodoStore.addMarkedTodo(todo);
    }
    console.log(markedTodoStore.markedTodos.length);
  };

  const onClick = () => {
    console.log("click is triggered");
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };

  function onBlurTextArea(newContent: string) {
    if (newContent !== todo.content) {
      setTodoContent.mutate({
        id: todo.id,
        content: newContent,
      });
    }
  }

  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          {...longPressEvent}
          className="my-1 select-none"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <div
            className={classNames(
              isMarked ? "ring-4 ring-laccent" : "",
              "group flex flex-col rounded-xl bg-gray-300 py-1 px-4 text-black hover:bg-newGray"
            )}
          >
            <div className="group flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={todoDone}
                onChange={() =>
                  setTodoDone.mutate({ id: todo.id, done: !todo.done })
                }
                className="h-6 w-6 rounded-full"
              />
              <textarea
                onBlur={(e) => {
                  onBlurTextArea(e.target.value);
                }}
                defaultValue={todo.content}
                className={classNames(
                  todo.done ? "line-through" : "",
                  "resize-none overflow-auto border-0 bg-gray-300 text-base outline-none group-hover:bg-newGray"
                )}
              />

              <EllipsisVerticalIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableTodoCard;
