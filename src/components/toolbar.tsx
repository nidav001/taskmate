import {
  ArrowRightIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import useMarkedTodoStore from "../hooks/markedTodoStore";
import useTodoOrderStore from "../hooks/todoOrderStore";
import useTodoStore from "../hooks/todoStore";
import { buttonStyle } from "../styles/buttonStyle";
import { trpc } from "../utils/trpc";

const Toolbar: React.FC<{
  todos: Todo[] | undefined;
  refetch: () => void;
  setSearchValue: (value: string) => void;
}> = ({ refetch, todos, setSearchValue }) => {
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
    const doneTodoIds = getTodoIds(todos, true);

    if (doneTodoIds.length > 0) {
      finalizeTodos.mutate({
        ids: doneTodoIds,
        done: true,
      });
    }
  }

  function handleOnClickArchive() {
    handleOnClickFinalize();
    const notDoneTodoIds = getTodoIds(todos, false);

    if (notDoneTodoIds.length > 0) {
      archiveTodos.mutate({
        ids: getTodoIds(todos, false),
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

export default Toolbar;
