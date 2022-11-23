import { type Todo } from "@prisma/client";
import { buttonStyle } from "../styles/buttonStyle";
import { trpc } from "../utils/trpc";

const TodoButtons: React.FC<{
  todos: Todo[] | undefined;
  refetch: () => void;
  setSearchValue: (value: string) => void;
}> = ({ refetch, todos, setSearchValue }) => {
  const validTodos = todos && todos.length && todos.length > 0;

  const currentlyDoneTodoIds = validTodos
    ? todos.filter((todo) => todo.done).map((todo) => todo.id)
    : [];

  const currentlyNotDoneTodoIds = validTodos
    ? todos.filter((todo) => !todo.done).map((todo) => todo.id)
    : [];

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

  function handleOnClickFinalize() {
    finalizeTodos.mutate({
      ids: currentlyDoneTodoIds,
      done: true,
    });
  }

  function handleOnClickArchive() {
    handleOnClickFinalize();
    archiveTodos.mutate({
      ids: currentlyNotDoneTodoIds,
      done: true,
    });
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
      </div>
    </>
  );
};

export default TodoButtons;
