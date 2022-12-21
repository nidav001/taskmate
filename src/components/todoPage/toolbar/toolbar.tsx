import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import useTodoOrderStore from "../../../hooks/todoOrderStore";
import useTodoStore from "../../../hooks/todoStore";
import { buttonStyle } from "../../../styles/buttonStyle";
import { trpc } from "../../../utils/trpc";
import Modal from "./modal";

type ToolbarProps = {
  refetch: () => void;
};

function Toolbar({ refetch }: ToolbarProps) {
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);
  const { resetTodoOrder } = useTodoOrderStore();
  const { todos: localTodos, setTodos, resetTodos } = useTodoStore();

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
    },
  });

  const archiveTodos = trpc.todo.archiveTodos.useMutation({
    onSuccess: () => {
      resetTodoOrder();
      refetch();
    },
    onMutate: () => {
      resetTodos();
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

  function handleOnClickArchive() {
    handleOnClickFinalize();
    const notDoneTodoIds = getTodoIds(localTodos, false);

    if (notDoneTodoIds.length > 0) {
      archiveTodos.mutate({
        ids: notDoneTodoIds,
        done: true,
      });
    }
  }

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
        <Modal
          title="Neue Woche starten"
          content="Wirklich alle Todos archivieren und fertige finalisieren?"
          buttonAccept="Ja"
          buttonDecline="Nein"
          isOpen={isArchivedModalOpen}
          setIsOpen={setIsArchivedModalOpen}
          onAccept={() => handleOnClickArchive()}
        />
      </div>
    </>
  );
}

export default Toolbar;
