import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import classNames from "classnames";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { type DraggableProvided } from "react-beautiful-dnd";
import useFinalizedTodoStore from "../../hooks/finalizedTodoStore";
import useMostRecentTodoIdStore from "../../hooks/mostRecentTodoStore";
import useTodoStore from "../../hooks/todoStore";
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
  const { regularTodos, sharedTodos, setTodos } = useTodoStore();

  const { finalizedTodos, setFinalizedTodos } = useFinalizedTodoStore();

  const [currentTodoContent, setCurrentTodoContent] = useState<string>(
    todo.content,
  );

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
        const newTodos = (todo.shared ? sharedTodos : regularTodos).map(
          (mappedTodo) => {
            if (todo.id === mappedTodo.id) {
              return { ...mappedTodo, checked: !mappedTodo.checked };
            }
            return mappedTodo;
          },
        );
        setTodos(todo.shared, newTodos);
      }
    },
  });

  const deleteTodo = trpc.todo.deleteTodo.useMutation();

  const updateTodoContent = trpc.todo.updateTodoContent.useMutation({
    onSuccess: () => {
      if (refetch) {
        refetch();
      }
    },
  });

  function onChangeTextArea(newContent: string) {
    if (newContent === todo.content) return;

    // Change local todo
    setCurrentTodoContent(newContent);

    // If empty --> delete
    if (newContent === "") {
      setTodos(
        false,
        regularTodos.filter((mappedTodo) => mappedTodo.id !== todo.id),
      );
      deleteTodo.mutate({ id: todo.id });
      return;
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
      className={`group mb-1 flex flex-col rounded-xl bg-gray-300 px-4 py-1 text-slate-900 hover:bg-gray-400 dark:bg-slate-600 dark:hover:bg-slate-600 ${
        getIsDragging() ? "bg-sky-200 dark:bg-slate-400" : ""
      }${showAnimation ? "animate-pulse" : ""}`}
    >
      <div
        ref={shouldUseRef() ? recentlyAddedTodo : null}
        className="group flex items-center justify-between"
      >
        <div className="pr-1">
          <input
            aria-label="check todo"
            disabled={!refetch}
            type="checkbox"
            checked={todo.checked}
            onChange={() =>
              setChecked.mutate({ id: todo.id, checked: !todo.checked })
            }
            className="h-6 w-6 rounded-full"
          />
        </div>
        <textarea
          aria-label="todo content"
          disabled={!refetch}
          onChange={(e) => {
            if (onChangeTextArea) {
              onChangeTextArea(e.target.value);
            }
          }}
          defaultValue={currentTodoContent}
          className={classNames(
            getIsDragging() ? "bg-sky-200 dark:bg-slate-400" : "",
            todo.checked && !todo.finalized ? "line-through" : "",
            "max-w-[220px] resize-none border-0 bg-gray-300 text-base font-medium focus:ring-0 group-hover:bg-gray-400 dark:bg-slate-600 dark:text-neutral-100 dark:group-hover:bg-slate-600",
          )}
        />
        <EllipsisVerticalIcon className="h-8 w-8 dark:text-neutral-100" />
      </div>
    </div>
  );
}
