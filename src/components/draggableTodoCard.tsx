import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import useMarkedTodoStore from "../hooks/markedTodoStore";
import classNames from "../utils/classNames";
import { trpc } from "../utils/trpc";

const DraggableTodoCard: React.FC<{
  todo: Todo;
  index: number;
  refetch: () => void;
}> = ({ todo, index, refetch }) => {
  const [todoDone, setTodoDoneState] = useState<boolean>(todo.done);

  const { markedTodos, addMarkedTodo } = useMarkedTodoStore();

  const setTodoDone = trpc.todo.setTodoDone.useMutation({
    onMutate: () => {
      setTodoDoneState(!todoDone);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const setTodoContent = trpc.todo.updateTodoContent.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const isMarked = markedTodos.includes(todo);

  const onLongPress = () => {
    console.log("longpress is triggered");
    if (!isMarked) {
      addMarkedTodo(todo);
    }
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

  // const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <div
          // {...longPressEvent}
          className="my-1 "
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
                  todoDone ? "line-through" : "",
                  "w-5/6 resize-none overflow-auto border-0 bg-gray-300 text-base outline-none group-hover:bg-newGray"
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
