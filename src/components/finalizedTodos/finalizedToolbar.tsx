import { ArrowUturnLeftIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import useFinalizedTodoStore from "../../hooks/finalizedTodoStore";
import { SnackbarCheckIcon } from "../../resources/icons";
import { basicIcon, buttonStyle } from "../../styles/basicStyles";
import { getCheckedTodoIds, refreshLocalTodos } from "../../utils/todoUtils";
import { useAlertEffect } from "../../utils/toolbarUtils";
import { trpc } from "../../utils/trpc";
import GenericModal from "../shared/genericModal";
import Snackbar from "../shared/snackbar";

type FinalizedToolbarProps = {
  refetch: () => void;
};

const funnyMessages = [
  "Ist wohl doch noch nicht fertig 🤔",
  "Was ist denn noch offen? 🤔",
  "Was vergessen? 🤔",
];

export default function FinalizedToolbar({ refetch }: FinalizedToolbarProps) {
  const { finalizedTodos, setFinalizedTodos } = useFinalizedTodoStore();
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useAlertEffect(showAlert, setShowAlert);

  const restoreTodos = trpc.todo.restoreTodos.useMutation({
    onMutate: (data) => {
      refreshLocalTodos(data.ids, setFinalizedTodos, finalizedTodos);
      setShowAlert(true);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const deleteFinalizedTodos = trpc.todo.deleteFinalizedTodos.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  function handleOnClickDelete() {
    deleteFinalizedTodos.mutate();
  }

  function handleOnClickRestore() {
    const todoIdsToRestore = getCheckedTodoIds(finalizedTodos);

    if (todoIdsToRestore.length > 0) {
      restoreTodos.mutate({
        ids: todoIdsToRestore,
      });
    }
  }

  return (
    <div className="flex w-full justify-evenly px-3 pt-4 md:w-3/4 lg:w-1/2">
      <button
        type="button"
        title="Wiederherstellen"
        onClick={() => handleOnClickRestore()}
        className={buttonStyle}
      >
        <ArrowUturnLeftIcon className={basicIcon} />
      </button>
      <button
        type="button"
        title="Alle löschen"
        onClick={() => setShowModal(true)}
        className={buttonStyle}
      >
        <TrashIcon className={basicIcon} />
      </button>
      <Snackbar
        showAlert={showAlert}
        message="Wiederhergestellt."
        randomMessages={funnyMessages}
        icon={<SnackbarCheckIcon />}
      />
      <GenericModal
        title="Alle Todos löschen"
        content="Es werden ALLE finalisierten Todos gelöscht."
        isOpen={showModal}
        buttonAccept="Okay"
        buttonDecline="Abbrechen"
        setIsOpen={() => setShowModal(!showModal)}
        onAccept={() => handleOnClickDelete()}
      />
    </div>
  );
}
