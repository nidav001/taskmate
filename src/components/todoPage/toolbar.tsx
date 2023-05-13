import { CheckIcon, PlusIcon, ShareIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import useColumnStore from "../../hooks/columnStore";
import useTodoStore from "../../hooks/todoStore";
import useViewStore from "../../hooks/viewStore";
import { SnackbarCheckIcon, SnackbarXIcon } from "../../resources/icons";
import { basicIcon, buttonStyle } from "../../styles/basicStyles";
import { View } from "../../types/enums";
import {
  getCheckedTodoIds,
  getCheckedTodos,
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
  "Nicht so schnell, der Server kommt nicht hinterher 🥵",
  "Beeindruckend 😳",
  "Das nächste Todo wartet schon 🫡",
  "Du coole Socke 😎",
  "Ganz stark 💪",
  "Liebe dich 😘"
];

export default function Toolbar() {
  const { regularTodos, sharedTodos, setTodos } = useTodoStore();
  const { regularColumns, sharedColumns, setTodoOrder } = useColumnStore();
  const { view, currentCollaborator } = useViewStore();
  const viewIsShared = view === View.Shared;
  const [columns, todos] = viewIsShared
    ? [sharedColumns, sharedTodos]
    : [regularColumns, regularTodos];

  const { value: showFinalizeAlert, setValue: setShowFinalizeAlert } =
    useAlertEffect();

  const { value: showShareAlert, setValue: setShowShareAlert } =
    useAlertEffect();

  const {
    value: showNoTodosSelectedAlert,
    setValue: setShowNoTodosSelectedAlert,
  } = useAlertEffect();

  const [showShareModal, setShowShareModal] = useState(false);

  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();

  function refreshTodosInOtherView(sharedWithEmail: string) {
    const todoIsBeingUnShared = sharedWithEmail !== "";
    const updatedTodos = getCheckedTodos(todos).map((todo) => {
      return {
        ...todo,
        checked: false,
        shared: !todo.shared,
        sharedWithEmail: todoIsBeingUnShared ? null : sharedWithEmail,
      };
    });

    const newTodos = (!viewIsShared ? sharedTodos : regularTodos).concat(
      updatedTodos
    );

    setTodos(!viewIsShared, newTodos);
  }

  function updateTodoOrder() {
    const todosToRemove = getCheckedTodos(todos);
    removeTodosFromTodoOrder(
      columns,
      todosToRemove,
      viewIsShared,
      setTodoOrder,
      updateTodoPosition
    );
  }

  function removeTodosFromCurrentView(ids: string[]) {
    const newTodos = todos.filter((todo) => !ids.includes(todo.id));
    setTodos(viewIsShared, newTodos);
  }

  function handleOnMutate(
    ids: string[],
    collaborator: string,
    isFinalizing = false
  ) {
    updateTodoOrder();
    removeTodosFromCurrentView(ids);
    if (!isFinalizing) refreshTodosInOtherView(collaborator);
  }

  const shareTodos = trpc.todo.shareTodos.useMutation({
    onMutate: (data) => handleOnMutate(data.ids, data.sharedWithEmail),
  });

  const unshareTodos = trpc.todo.unshareTodos.useMutation({
    onMutate: (data) => handleOnMutate(data.ids, ""),
  });

  const finalizeTodos = trpc.todo.finalizeTodos.useMutation({
    onMutate: (data) => handleOnMutate(data.ids, "", true),
  });

  function handleOnClickFinalize() {
    const doneTodoIds = getCheckedTodoIds(todos);

    if (doneTodoIds.length > 0) {
      setShowFinalizeAlert(true);
      finalizeTodos.mutate({
        ids: doneTodoIds,
      });
    } else {
      setShowNoTodosSelectedAlert(true);
    }
  }

  function handleShare() {
    const todoIdsToShare = getCheckedTodoIds(todos);
    if (todoIdsToShare.length > 0) {
      setShowShareAlert(true);

      shareTodos.mutate({
        ids: todoIdsToShare,
        sharedWithEmail: currentCollaborator,
      });
    }
  }

  function handleUnshare() {
    const todoIdsToUnshare = getCheckedTodoIds(todos);
    if (todoIdsToUnshare.length > 0) {
      setShowShareAlert(true);
      unshareTodos.mutate({
        ids: todoIdsToUnshare,
      });
    }
  }

  function handleShareButtonClicked() {
    const checkedTodoIds = getCheckedTodoIds(todos);

    if (checkedTodoIds.length > 0) {
      setShowShareModal(true);
    } else {
      setShowNoTodosSelectedAlert(true);
    }
  }

  return (
    <div className="flex w-full justify-between px-3 py-2 md:w-3/4 lg:w-1/2">
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
        title={viewIsShared ? "Nicht mehr teilen" : "Teilen"}
        onClick={() => handleShareButtonClicked()}
        className={buttonStyle}
      >
        {/* {viewIsShared ? "UNSHARE" : <ShareIcon className="w-8 w-8" />} */}
        <ShareIcon className="w-8 w-8" />
      </button>
      <Snackbar
        showAlert={showFinalizeAlert}
        message="Erledigt."
        randomMessages={funnyMessages}
        icon={<SnackbarCheckIcon />}
      />
      <Snackbar
        showAlert={showNoTodosSelectedAlert}
        message="Keine Todos ausgewählt."
        icon={<SnackbarXIcon />}
      />
      <Snackbar
        message={
          viewIsShared
            ? "Todo zu deinen Todos hinzugefügt"
            : `Todo geteilt mit ${currentCollaborator}. Sieh's dir an ➡️`
        }
        showAlert={showShareAlert}
        icon={<SnackbarCheckIcon />}
      />
      <GenericModal
        isOpen={showShareModal}
        buttonAccept={viewIsShared ? "Ja" : "Teilen"}
        buttonDecline={viewIsShared ? "Nein" : "Abbrechen"}
        setIsOpen={setShowShareModal}
        title={viewIsShared ? "Teilen aufheben" : "Teilen mit..."}
        onAccept={viewIsShared ? handleUnshare : handleShare}
        content={
          viewIsShared ? (
            "Teilen wirklich aufheben?"
          ) : (
            <CollaboratorCombobox canAddEmail />
          )
        }
      />
    </div>
  );
}
