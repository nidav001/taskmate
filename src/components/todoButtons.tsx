import {
  ArrowRightIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import useMarkedTodoStore from "../hooks/markedTodoStore";
import useTodoOrderStore from "../hooks/todoOrderStore";
import { buttonStyle } from "../styles/buttonStyle";
import { trpc } from "../utils/trpc";

const TodoButtons: React.FC<{
  todos: Todo[] | undefined;
  refetch: () => void;
  setSearchValue: (value: string) => void;
}> = ({ refetch, todos, setSearchValue }) => {
  const { markedTodos, resetMarkedTodos } = useMarkedTodoStore();
  const { todoOrder, setTodoOrder, resetTodoOrder } = useTodoOrderStore();

  const getDoneTodoIds = (todos: Todo[] | undefined): string[] => {
    return todos?.filter((todo) => todo.done).map((todo) => todo.id) ?? [];
  };

  const getNotDoneTodoIds = (todos: Todo[] | undefined): string[] => {
    return todos?.filter((todo) => !todo.done).map((todo) => todo.id) ?? [];
  };

  const finalizeTodos = trpc.todo.finalizeTodos.useMutation({
    onSuccess: () => {
      resetTodoOrder();
      refetch();
    },
  });

  const archiveTodos = trpc.todo.archiveTodos.useMutation({
    onSuccess: () => {
      resetTodoOrder();
      refetch();
    },
  });

  const deleteTodos = trpc.todo.deleteTodos.useMutation({
    onSuccess: () => {
      resetTodoOrder();
      refetch();
    },
  });

  function handleOnClickFinalize() {
    const doneTodoIds = getDoneTodoIds(todos);

    if (doneTodoIds.length > 0) {
      finalizeTodos.mutate({
        ids: doneTodoIds,
        done: true,
      });
    }
  }

  function handleOnClickArchive() {
    handleOnClickFinalize();
    const notDoneTodoIds = getNotDoneTodoIds(todos);

    if (notDoneTodoIds.length > 0) {
      archiveTodos.mutate({
        ids: getNotDoneTodoIds(todos),
        done: true,
      });
    }
  }

  function handleOnClickDeleteMany() {
    handleOnClickFinalize();
    deleteTodos.mutate({
      ids: getNotDoneTodoIds(todos),
    });
  }

  function handleOnClickDeleteMarked() {
    const markedTodoIds = markedTodos.map((todo) => todo.id);
    if (markedTodoIds.length > 0) {
      deleteTodos.mutate({
        ids: markedTodoIds,
      });
      resetMarkedTodos();
    }
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <input
          type="text"
          className="w-50 rounded-xl"
          placeholder="Search..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="flex gap-2 px-3">
        <button
          title="Finalisieren"
          onClick={() => handleOnClickFinalize()}
          className={buttonStyle}
        >
          <CheckIcon className="h-8 w-8" />
        </button>
        <button
          title="Archivieren"
          onClick={() => handleOnClickArchive()}
          className={buttonStyle}
        >
          <ArrowRightIcon className="h-8 w-8" />
        </button>
        <button
          title="Neue Woche und verwerfen"
          onClick={() => handleOnClickDeleteMany()}
          className={buttonStyle}
        >
          Neue Woche und verwerfen
        </button>
        {markedTodos.length > 0 ? (
          <button
            title="Löschen"
            onClick={() => handleOnClickDeleteMarked()}
            className={buttonStyle}
          >
            <TrashIcon className="h-8 w-8" />
          </button>
        ) : null}
      </div>
    </>
  );
};

export default TodoButtons;
