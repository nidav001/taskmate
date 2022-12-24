import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { type DraggableProvided } from "react-beautiful-dnd";
import classNames from "../../utils/classNames";
import { trpc } from "../../utils/trpc";

type TodoCardProps = {
  todoDone: boolean;
  setTodoDone?: (id: string, done: boolean) => void;
  todo: Todo;
  onBlurTextArea?: (newContent: string) => void;
  disclosureOpen?: boolean;
  isDragging: boolean;
  provided?: DraggableProvided;
  todoRef?: React.RefObject<HTMLDivElement>;
};

export default function TodoCard({
  todoDone,
  setTodoDone,
  todo,
  onBlurTextArea,
  isDragging,
  provided,
  todoRef,
}: TodoCardProps) {
  const handleOnChange = () => {
    if (setTodoDone) {
      setTodoDone(todo.id, !todo.done);
    }
  };

  const [showAnimation, setShowAnimation] = useState<boolean>(false);

  const mostRecentTodo = trpc.todo.getMostRecentTodo.useQuery().data ?? null;

  function isMostRecent() {
    return mostRecentTodo?.id === todo.id;
  }

  function shouldUseRef() {
    return (
      isMostRecent() &&
      DateTime.now().toMillis() <= mostRecentTodo.createdAt.getTime() + 10000
    );
  }

  useEffect(() => {
    if (shouldUseRef()) {
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
      }, 4000);
    }
  }, []);

  return (
    <div
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      ref={provided?.innerRef}
      className={`group my-1 flex flex-col rounded-xl bg-gray-300 py-1 px-4 text-black hover:bg-gray-400 dark:bg-slate-500 dark:hover:bg-slate-600 ${
        isDragging === undefined ? "bg-sky-200 dark:bg-slate-300" : ""
      }${showAnimation ? "animate-pulse" : ""}`}
    >
      <div
        ref={shouldUseRef() ? todoRef : null}
        className="group flex items-center justify-between gap-2"
      >
        <input
          type="checkbox"
          readOnly={setTodoDone ? false : true}
          checked={todoDone}
          onChange={() => handleOnChange()}
          className="h-6 w-6 rounded-full"
        />
        <textarea
          disabled={setTodoDone ? false : true}
          onBlur={(e) => {
            if (onBlurTextArea) {
              onBlurTextArea(e.target.value);
            }
          }}
          defaultValue={todo.content}
          className={classNames(
            isDragging === undefined ? "bg-sky-200 dark:bg-slate-300" : "",
            todoDone ? "line-through" : "",
            "resize-none border-0 bg-gray-300 text-base font-medium focus:ring-0 group-hover:bg-gray-400 dark:bg-slate-500 dark:group-hover:bg-slate-600"
          )}
        />
        <EllipsisVerticalIcon className="h-8 w-8" />
      </div>
    </div>
  );
}
