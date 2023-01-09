import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import useTodoStore from "../../hooks/todoStore";
import { basicIcon, buttonStyle } from "../../styles/basicStyles";
import { trpc } from "../../utils/trpc";
import Snackbar from "../shared/snackbar";

type ToolbarProps = {
  refetch: () => void;
};

export default function Toolbar({ refetch }: ToolbarProps) {
  const { todos: localTodos, setTodos } = useTodoStore();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!showAlert) return;

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [showAlert]);

  const getTodoIds = (
    todos: Todo[] | undefined,
    checked: boolean
  ): string[] => {
    return (
      todos
        ?.filter((todo) => todo.checked === checked)
        .map((todo) => todo.id) ?? []
    );
  };

  const refreshLocalTodos = (ids: string[]) => {
    const newTodos = localTodos?.filter((todo) => !ids.includes(todo.id));
    setTodos(newTodos);
  };

  const finalizeTodos = trpc.todo.finalizeTodos.useMutation({
    onSuccess: () => {
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
        checked: true,
      });
    }
  }

  const funnyMessages = [
    "Endlich geschafft 🥹",
    "Schneller als gedacht 😘",
    "Super 😍",
    "Weiter so 😘",
    "Hammer 🤩",
    "Gut gemacht 😍",
    "Liebe dich 🥰",
    "Nicht so schnell, der Server kommt nicht hinterher 🥵",
    "Beeindruckend 😳",
    "Das nächste Todo wartet schon 🫡",
    "Du coole Socke 😎",
    "Ganz stark 💪",
  ];

  return (
    <>
      <div className="flex w-full justify-evenly px-3 md:w-3/4 lg:w-1/2">
        <Link href="/addTodo" className={buttonStyle}>
          <PlusIcon className={basicIcon} />
        </Link>
        <button
          title="Finalisieren"
          onClick={() => handleOnClickFinalize()}
          className={buttonStyle}
        >
          <CheckIcon className={basicIcon} />
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
