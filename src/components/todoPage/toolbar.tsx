import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import useColumnStore from "../../hooks/columnStore";
import useTodoStore from "../../hooks/todoStore";
import { basicIcon, buttonStyle } from "../../styles/basicStyles";
import {
  getCheckedTodoIds,
  getCheckedTodos,
  refreshLocalTodos,
  removeTodosFromTodoOrder,
} from "../../utils/todoUtils";
import { useAlertEffect } from "../../utils/toolbarUtils";
import { trpc } from "../../utils/trpc";
import Snackbar from "../shared/snackbar";

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

export default function Toolbar() {
  const { regularTodos, setTodos } = useTodoStore();
  const [showAlert, setShowAlert] = useState(false);
  const { regularColumns, setTodoOrder } = useColumnStore();
  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();

  useAlertEffect(showAlert, setShowAlert);

  const finalizeTodos = trpc.todo.finalizeTodos.useMutation({
    onMutate: (data) => {
      const todosToRemoveFromTodoOrder = getCheckedTodos(
        regularTodos,
        data.ids
      );
      todosToRemoveFromTodoOrder.forEach((todo) => {
        removeTodosFromTodoOrder(
          regularColumns,
          todosToRemoveFromTodoOrder,
          setTodoOrder,
          updateTodoPosition
        );
        updateTodoPosition.mutate({
          id: todo.id,
          day: todo.day,
          index: -1,
        });
      });

      refreshLocalTodos(data.ids, setTodos, regularTodos);
      setShowAlert(true);
    },
  });

  function handleOnClickFinalize() {
    const doneTodoIds = getCheckedTodoIds(regularTodos);

    if (doneTodoIds.length > 0) {
      finalizeTodos.mutate({
        ids: doneTodoIds,
      });
    }
  }

  return (
    <div className="flex w-full justify-evenly px-3 md:w-3/4 lg:w-1/2">
      <Link href="/addTodo" className={buttonStyle}>
        <PlusIcon className={basicIcon} />
      </Link>
      <button
        type="submit"
        title="Finalisieren"
        onClick={() => handleOnClickFinalize()}
        className={buttonStyle}
      >
        <CheckIcon className={basicIcon} />
      </button>
      <Snackbar
        showAlert={showAlert}
        message="Erledigt."
        randomMessages={funnyMessages}
      />
    </div>
  );
}
