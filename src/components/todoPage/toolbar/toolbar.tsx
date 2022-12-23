import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import useTodoOrderStore from "../../../hooks/todoOrderStore";
import useTodoStore from "../../../hooks/todoStore";
import { buttonStyle } from "../../../styles/buttonStyle";
import { trpc } from "../../../utils/trpc";
import Snackbar from "../../shared/snackbar";

type ToolbarProps = {
  refetch: () => void;
};

function Toolbar({ refetch }: ToolbarProps) {
  const { resetTodoOrder } = useTodoOrderStore();
  const { todos: localTodos, setTodos } = useTodoStore();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert]);

  const getTodoIds = (todos: Todo[] | undefined, done: boolean): string[] => {
    return (
      todos?.filter((todo) => todo.done === done).map((todo) => todo.id) ?? []
    );
  };

  const refreshLocalTodos = (ids: string[]) => {
    const newTodos = localTodos?.filter((todo) => !ids.includes(todo.id));
    setTodos(newTodos);
  };

  const finalizeTodos = trpc.todo.finalizeTodos.useMutation({
    onSuccess: () => {
      resetTodoOrder();
      refetch();
    },
    onMutate: (data) => {
      refreshLocalTodos(data.ids);
      setShowAlert(true);
    },
  });

  function handleOnClickFinalize() {
    const doneTodoIds = getTodoIds(localTodos, true);

    if (doneTodoIds.length > 0) {
      finalizeTodos.mutate({
        ids: doneTodoIds,
        done: true,
      });
    }
  }

  const funnyMessages = [
    "Endlich geschafft :)",
    "Gut gemacht :)",
    "Super :)",
    "Weiter so :)",
  ];

  const iconStyle = "h-8 w-8";

  return (
    <>
      <div className="flex w-full justify-evenly px-3 md:w-3/4 lg:w-1/2">
        <Link href="/addTodo" className={buttonStyle}>
          <PlusIcon className={iconStyle} />
        </Link>
        <button
          title="Finalisieren"
          onClick={() => handleOnClickFinalize()}
          className={buttonStyle}
        >
          <CheckIcon className={iconStyle} />
        </button>
        <Snackbar
          showAlert={showAlert}
          message={"Erledigt."}
          randomMessages={funnyMessages}
        />
      </div>
    </>
  );
}

export default Toolbar;
