import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { type DraggableProvided } from "react-beautiful-dnd";
import useMostRecentTodoIdStore from "../../hooks/mostRecentTodoStore";
import classNames from "../../utils/classNames";

type TodoCardProps = {
  setDone?: (id: string, done: boolean) => void;
  todo: Todo;
  onBlurTextArea?: (newContent: string) => void;
  disclosureOpen?: boolean;
  isDragging: boolean;
  provided?: DraggableProvided;
  todoRef?: React.RefObject<HTMLDivElement>;
  setRestored?: (id: string, done: boolean) => void;
};

export default function TodoCard({
  setDone,
  todo,
  onBlurTextArea,
  isDragging,
  provided,
  setRestored: setRestore,
}: TodoCardProps) {
  const handleOnChange = () => {
    if (setDone) {
      setDone(todo.id, !todo.done);
    } else if (setRestore) {
      setRestore(todo.id, !todo.restored);
    }
  };

  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const recentlyAddedTodo = useRef<null | HTMLDivElement>(null);

  const { mostRecentTodoId, todoCreatedAtMilliseconds: todoCreatedAt } =
    useMostRecentTodoIdStore();

  function isMostRecent() {
    return mostRecentTodoId === todo.id;
  }

  function shouldUseRef() {
    return isMostRecent() && DateTime.now().toMillis() <= todoCreatedAt + 10000;
  }

  useEffect(() => {
    if (shouldUseRef()) {
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
      }, 4000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getIsDragging() {
    return isDragging === undefined ? true : isDragging;
  }

  const executeScroll = () => {
    if (recentlyAddedTodo.current) {
      recentlyAddedTodo.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    if (recentlyAddedTodo.current) {
      executeScroll();
      recentlyAddedTodo.current = null;
    }
  }, [mostRecentTodoId]);

  return (
    <div
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      ref={provided?.innerRef}
      className={`group my-1 flex flex-col rounded-xl bg-gray-300 py-1 px-4 text-black hover:bg-gray-400 dark:bg-slate-500 dark:hover:bg-slate-600 ${
        getIsDragging() ? "bg-sky-200 dark:bg-slate-300" : ""
      }${showAnimation ? "animate-pulse" : ""}`}
    >
      <div
        ref={shouldUseRef() ? recentlyAddedTodo : null}
        className="group flex items-center justify-between"
      >
        <input
          type="checkbox"
          checked={todo.done && !todo.finalized ? true : false}
          onChange={() => handleOnChange()}
          className="h-6 w-6 rounded-full"
        />
        <textarea
          disabled={!setDone || !setRestore ? true : false}
          onBlur={(e) => {
            if (onBlurTextArea) {
              onBlurTextArea(e.target.value);
            }
          }}
          defaultValue={todo.content}
          className={classNames(
            getIsDragging() ? "bg-sky-200 dark:bg-slate-300" : "",
            todo.done && !todo.finalized ? "line-through" : "",
            "resize-none border-0 bg-gray-300 text-base font-medium focus:ring-0 group-hover:bg-gray-400 dark:bg-slate-500 dark:group-hover:bg-slate-600"
          )}
        />
        <EllipsisVerticalIcon className="h-8 w-8" />
      </div>
    </div>
  );
}
