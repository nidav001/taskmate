import { ArrowUturnLeftIcon, TrashIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import { useEffect, useState } from "react";
import useTodoStore from "../../hooks/todoStore";
import { basicIcon, buttonStyle } from "../../styles/basicStyles";
import { trpc } from "../../utils/trpc";
import Snackbar from "../shared/snackbar";

type GeneralAndFinalizedToolbarProps = {
  refetch?: () => void;
  todos: Todo[];
  todosToRestore: Todo[];
  setTodosToRestore: (todos: Todo[]) => void;
};

export default function GeneralAndFinalizedToolbar({
  refetch,
  todos,
  todosToRestore,
  setTodosToRestore,
}: GeneralAndFinalizedToolbarProps) {
  const { todos: localTodos, setTodos } = useTodoStore();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!showAlert) return;

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [showAlert]);

  const getTodoIds = (todos: Todo[] | undefined): string[] => {
    return (
      todos?.filter((todo) => todo.restored === true).map((todo) => todo.id) ??
      []
    );
  };

  const refreshLocalTodos = (ids: string[]) => {
    const todosToRestore = todos.filter((todo) => ids.includes(todo.id));
    const newTodos = localTodos;
    todosToRestore.forEach((todo) => {
      todo.finalized = false;
      todo.checked = false;
      newTodos.push(todo);
    });
    setTodos(newTodos);
  };

  const restoreTodos = trpc.todo.restoreTodos.useMutation({
    // // onSuccess: () => {
    // //   refetch();
    // // },
    onMutate: (data) => {
      refreshLocalTodos(data.ids);
      setShowAlert(true);
    },
  });

  function handleOnClickRestore() {
    const restoredTodoIds = getTodoIds(todos);

    if (restoredTodoIds.length > 0) {
      restoreTodos.mutate({
        ids: restoredTodoIds,
      });
    }
  }

  const funnyMessages = [
    "Ist wohl doch noch nicht fertig 🤔",
    "Was ist denn noch offen? 🤔",
  ];

  function handleOnClickDelete() {
    const deletedTodoIds = getTodoIds(todos);

    if (deletedTodoIds.length > 0) {
      trpc.todo.deleteTodos.mutate({
        ids: deletedTodoIds,
      });
      refetch();
    }
  }

  return (
    <>
      <div className="flex w-full justify-evenly px-3 md:w-3/4 lg:w-1/2">
        <button
          title="Wiederherstellen"
          onClick={() => handleOnClickRestore()}
          className={buttonStyle}
        >
          <ArrowUturnLeftIcon className={basicIcon} />
        </button>
        <button
          title="Alle löschen"
          onClick={() => handleOnClickDelete()}
          className={buttonStyle}
        >
          <TrashIcon className={basicIcon} />
        </button>
        <Snackbar
          showAlert={showAlert}
          message={"Wiederhergestellt."}
          randomMessages={funnyMessages}
        />
      </div>
    </>
  );
}
