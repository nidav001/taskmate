import { ArrowUturnLeftIcon, TrashIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import { useEffect, useState } from "react";
import { basicIcon, buttonStyle } from "../../styles/basicStyles";
import { trpc } from "../../utils/trpc";
import Snackbar from "../shared/snackbar";

type GeneralAndFinalizedToolbarProps = {
  refetch: () => void;
  todos: Todo[];
};

export default function GeneralAndFinalizedToolbar({
  refetch,
  todos,
}: GeneralAndFinalizedToolbarProps) {
  const [showAlert, setShowAlert] = useState(false);

  const deleteFinalizedTodos = trpc.todo.deleteFinalizedTodos.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (!showAlert) return;

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [showAlert]);

  const getTodoIds = (todos: Todo[] | undefined): string[] => {
    return (
      todos?.filter((todo) => todo.checked === true).map((todo) => todo.id) ??
      []
    );
  };

  const restoreTodos = trpc.todo.restoreTodos.useMutation({
    onMutate: (data) => {
      //refreshLocaltodos
      setShowAlert(true);
    },
    onSuccess: () => {
      refetch();
    },
  });

  function handleOnClickRestore() {
    const todoIdsToRestore = getTodoIds(todos);

    if (todoIdsToRestore.length > 0) {
      restoreTodos.mutate({
        ids: todoIdsToRestore,
      });
    }
  }

  const funnyMessages = [
    "Ist wohl doch noch nicht fertig 🤔",
    "Was ist denn noch offen? 🤔",
    "Was vergessen? 🤔",
  ];

  function handleOnClickDelete() {
    deleteFinalizedTodos.mutate();
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
