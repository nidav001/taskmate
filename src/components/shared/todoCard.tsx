import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { type DraggableProvided } from "react-beautiful-dnd";
import useColumnStore from "../../hooks/columnStore";
import useFinalizedTodoStore from "../../hooks/finalizedTodoStore";
import useMostRecentTodoIdStore from "../../hooks/mostRecentTodoStore";
import useTodoStore from "../../hooks/todoStore";
import classNames from "../../utils/classNames";
import { removeTodoFromTodoOrder } from "../../utils/todoUtils";
import { trpc } from "../../utils/trpc";

type TodoCardProps = {
  todo: Todo;
  isDragging: boolean;
  provided?: DraggableProvided;
  restore: boolean;
  refetch?: () => void;
};

export default function TodoCard({
  todo,
  isDragging,
  provided,
  refetch,
  restore,
}: TodoCardProps) {
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const recentlyAddedTodo = useRef<null | HTMLDivElement>(null);
  const { regularTodos, setTodos } = useTodoStore();

  const { finalizedTodos, setFinalizedTodos } = useFinalizedTodoStore();

  const { regularColumns, setTodoOrder } = useColumnStore();

  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();

  const setChecked = trpc.todo.setChecked.useMutation({
    onMutate: () => {
      if (restore) {
        const newTodos = finalizedTodos.map((mappedTodo) => {
          if (todo.id === mappedTodo.id) {
            return { ...mappedTodo, checked: !mappedTodo.checked };
          }
          return mappedTodo;
        });
        setFinalizedTodos(newTodos);
      } else {
        // Update local state
        const newTodos = regularTodos.map((mappedTodo) => {
          if (todo.id === mappedTodo.id) {
            return { ...mappedTodo, checked: !mappedTodo.checked };
          }
          return mappedTodo;
        });
        setTodos(false, newTodos);
      }
    },
  });

  const updateTodoContent = trpc.todo.updateTodoContent.useMutation({
    onSuccess: () => {
      if (refetch) {
        refetch();
      }
    },
    onMutate: () => {
      removeTodoFromTodoOrder(
        regularColumns,
        todo,
        setTodoOrder,
        updateTodoPosition
      );
    },
  });

  function onBlurTextArea(newContent: string) {
    // Change local todos
    if (newContent === todo.content) return;

    // If empty --> delete locally and later in db
    if (newContent === "") {
      setTodos(
        false,
        regularTodos.filter((mappedTodo) => mappedTodo.id !== todo.id)
      );
    }

    // Update todo in db
    updateTodoContent.mutate({
      id: todo.id,
      content: newContent,
    });
  }

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
          disabled={!refetch}
          type="checkbox"
          checked={todo.checked}
          onChange={() =>
            setChecked.mutate({ id: todo.id, checked: !todo.checked })
          }
          className="h-6 w-6 rounded-full"
        />
        <textarea
          disabled={!refetch}
          onBlur={(e) => {
            if (onBlurTextArea) {
              onBlurTextArea(e.target.value);
            }
          }}
          defaultValue={todo.content}
          className={classNames(
            getIsDragging() ? "bg-sky-200 dark:bg-slate-300" : "",
            todo.checked && !todo.finalized ? "line-through" : "",
            "resize-none border-0 bg-gray-300 text-base font-medium focus:ring-0 group-hover:bg-gray-400 dark:bg-slate-500 dark:group-hover:bg-slate-600"
          )}
        />
        <EllipsisVerticalIcon className="h-8 w-8" />
      </div>
    </div>
  );
}
