import {
  ArrowRightIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import useMarkedTodoStore from "../../../hooks/markedTodoStore";
import useTodoOrderStore from "../../../hooks/todoOrderStore";
import useTodoStore from "../../../hooks/todoStore";
import { trpc } from "../../../utils/trpc";
import MyModal from "./modal";

const Toolbar: React.FC<{
  todos: Todo[] | undefined;
  refetch: () => void;
}> = ({ refetch, todos }) => {
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);
  const [isDeletedModelOpen, setIsDeletedModelOpen] = useState(false);

  const { markedTodos, resetMarkedTodos } = useMarkedTodoStore();
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

  const deleteTodos = trpc.todo.deleteTodos.useMutation({
    onSuccess: () => {
      resetTodoOrder();
      refetch();
    },
    onMutate: (data) => {
      refreshLocalTodos(data.ids);
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

  function handleOnClickDeleteMany() {
    handleOnClickFinalize();
    deleteTodos.mutate({
      ids: getTodoIds(todos, false),
    });
  }

  // function handleOnClickDeleteMarked() {
  //   const markedTodoIds = markedTodos.map((todo) => todo.id);
  //   if (markedTodoIds.length > 0) {
  //     deleteTodos.mutate({
  //       ids: markedTodoIds,
  //     });
  //     resetMarkedTodos();
  //   }
  // }

  const buttonStyle = "rounded-full bg-dark/20 hover:bg-laccent p-3";

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
        <button
          title="Archivieren"
          onClick={() => {
            if (localTodos?.length > 0) {
              setIsArchivedModalOpen(true);
            }
          }}
          className={buttonStyle}
        >
          <ArrowRightIcon className={iconStyle} />
        </button>
        <button
          title="Neue Woche und verwerfen"
          onClick={() => {
            if (localTodos?.length > 0) {
              setIsDeletedModelOpen(true);
            }
          }}
          className={buttonStyle}
        >
          <TrashIcon className={iconStyle} />
        </button>
        {/* {markedTodos.length > 0 ? (
          <button
            title="Löschen"
            onClick={() => handleOnClickDeleteMarked()}
            className={buttonStyle}
          >
            <TrashIcon className="h-8 w-8" />
          </button>
        ) : null} */}
        <MyModal
          title="Neue Woche starten"
          content="Wirklich alle Todos archivieren und fertige finalisieren?"
          buttonAccept="Ja"
          buttonDecline="Nein"
          isOpen={isArchivedModalOpen}
          setIsOpen={setIsArchivedModalOpen}
          onAccept={() => handleOnClickArchive()}
        />
        <MyModal
          title="Neue Woche starten und Todos verwerfen"
          content="Wirklich alle Todos löschen?"
          buttonAccept="Ja"
          buttonDecline="Nein"
          isOpen={isDeletedModelOpen}
          setIsOpen={setIsDeletedModelOpen}
          onAccept={() => handleOnClickDeleteMany()}
        />
      </div>
    </>
  );
};

export default Toolbar;
