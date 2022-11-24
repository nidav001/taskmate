import { TrashIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import useMarkedTodoStore from "../hoooks/markedTodoStore";
import { buttonStyle } from "../styles/buttonStyle";
import { trpc } from "../utils/trpc";

const TodoButtons: React.FC<{
  todos: Todo[] | undefined;
  refetch: () => void;
  setSearchValue: (value: string) => void;
}> = ({ refetch, todos, setSearchValue }) => {
  const areTodosValid = (todos: Todo[] | undefined) =>
    todos && todos.length && todos.length > 0;

  const markedTodoStore = useMarkedTodoStore();

  const getDoneTodoIds = (todos: Todo[] | undefined) => {
    areTodosValid(todos)
      ? todos?.filter((todo) => todo.done).map((todo) => todo.id)
      : [];
  };

  const getNotDoneTodoIds = (todos: Todo[] | undefined) => {
    areTodosValid(todos)
      ? todos?.filter((todo) => !todo.done).map((todo) => todo.id)
      : [];
  };

  const finalizeTodos = trpc.todo.finalizeTodos.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const archiveTodos = trpc.todo.archiveTodos.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteTodos = trpc.todo.deleteTodos.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  function handleOnClickFinalize() {
    finalizeTodos.mutate({
      ids: getDoneTodoIds(todos),
      done: true,
    });
  }

  function handleOnClickArchive() {
    handleOnClickFinalize();
    archiveTodos.mutate({
      ids: getNotDoneTodoIds(todos),
      done: true,
    });
  }

  function handleOnClickDeleteMany() {
    handleOnClickFinalize();
    deleteTodos.mutate({
      ids: getNotDoneTodoIds,
    });
  }

  function handleOnClickDelete() {
    deleteTodos.mutate({
      ids: markedTodoStore.markedTodos.map((todo) => todo.id),
    });
    markedTodoStore.resetMarkedTodos();
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
      <div className="flex gap-2">
        <button onClick={() => handleOnClickFinalize()} className={buttonStyle}>
          Finalisieren
        </button>
        <button onClick={() => handleOnClickArchive()} className={buttonStyle}>
          Neue Woche
        </button>
        <button
          onClick={() => handleOnClickDeleteMany()}
          className={buttonStyle}
        >
          Neue Woche und verwerfen
        </button>
        {markedTodoStore.markedTodos.length > 0 ? (
          <button onClick={() => handleOnClickDelete()} className={buttonStyle}>
            <TrashIcon className="h-6 w-6" />
          </button>
        ) : null}
      </div>
    </>
  );
};

export default TodoButtons;
