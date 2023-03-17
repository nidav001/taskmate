import { CheckIcon, PlusIcon, ShareIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import useColumnStore from "../../hooks/columnStore";
import useTodoStore from "../../hooks/todoStore";
import useViewStore from "../../hooks/viewStore";
import { basicIcon, buttonStyle } from "../../styles/basicStyles";
import { View } from "../../types/enums";
import {
  getCheckedTodoIds,
  getCheckedTodos,
  refreshLocalTodos,
  removeTodosFromTodoOrder,
} from "../../utils/todoUtils";
import { useAlertEffect } from "../../utils/toolbarUtils";
import { trpc } from "../../utils/trpc";
import CollaboratorCombobox from "../shared/collaboratorComcobox";
import GenericModal from "../shared/genericModal";
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
  const { regularTodos, sharedTodos, setTodos } = useTodoStore();
  const { regularColumns, sharedColumns, setTodoOrder } = useColumnStore();
  const { view } = useViewStore();
  const viewIsShared = view === View.Shared;
  const [columns, todos] = viewIsShared
    ? [sharedColumns, sharedTodos]
    : [regularColumns, regularTodos];

  const [showFinalizeAlert, setShowFinalizeAlert] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();
  const shareTodos = trpc.todo.shareTodos.useMutation();
  const unshareTodos = trpc.todo.unshareTodos.useMutation();

  useAlertEffect(showFinalizeAlert, setShowFinalizeAlert);

  const finalizeTodos = trpc.todo.finalizeTodos.useMutation({
    onMutate: (data) => {
      const todosToRemoveFromTodoOrder = getCheckedTodos(todos, data.ids);
      todosToRemoveFromTodoOrder.forEach((todo) => {
        removeTodosFromTodoOrder(
          columns,
          todosToRemoveFromTodoOrder,
          viewIsShared,
          setTodoOrder,
          updateTodoPosition
        );
        updateTodoPosition.mutate({
          id: todo.id,
          day: todo.day,
          index: -1,
        });
      });

      refreshLocalTodos(data.ids, setTodos, todos);
      setShowFinalizeAlert(true);
    },
  });

  function handleOnClickFinalize() {
    const doneTodoIds = getCheckedTodoIds(todos);

    if (doneTodoIds.length > 0) {
      finalizeTodos.mutate({
        ids: doneTodoIds,
      });
    }
  }

  function handleShare() {
    // const todoIdsToShare = getCheckedTodoIds(todos);
    // if (todoIdsToShare.length > 0) {
    //   shareTodos.mutate({
    //     ids: todoIdsToShare,
    //     sharedWithEmail: currentCollaborator,
    //   });
    // }
  }

  function handleUnShare() {
    // const todoIdsToUnshare = getCheckedTodoIds(todos);
    // if (todoIdsToUnshare.length > 0) {
    //   unshareTodos.mutate({
    //     ids: todoIdsToUnshare,
    //   });
    // }
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

      <button
        type="button"
        title="Teilen"
        onClick={() => setShowShareModal(true)}
        className={buttonStyle}
      >
        {viewIsShared ? "UNSHARE" : <ShareIcon className="w-8 w-8" />}
      </button>
      <Snackbar
        showAlert={showFinalizeAlert}
        message="Erledigt."
        randomMessages={funnyMessages}
      />
      <GenericModal
        isOpen={showShareModal}
        buttonAccept="Teilen"
        buttonDecline="Abbrechen"
        setIsOpen={setShowShareModal}
        title="Teilen mit..."
        onAccept={viewIsShared ? handleUnShare : handleShare}
        content={<CollaboratorCombobox canAddEmail />}
      />
    </div>
  );
}
