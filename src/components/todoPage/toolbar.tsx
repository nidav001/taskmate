import { CheckIcon, PlusIcon, ShareIcon } from "@heroicons/react/20/solid";
import { Todo } from "@prisma/client";
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
  "Nicht so schnell, der Server kommt nicht hinterher 🥵",
  "Beeindruckend 😳",
  "Das nächste Todo wartet schon 🫡",
  "Du coole Socke 😎",
  "Ganz stark 💪",
];

export default function Toolbar() {
  const { regularTodos, sharedTodos, setTodos } = useTodoStore();
  const { regularColumns, sharedColumns, setTodoOrder } = useColumnStore();
  const { view, currentCollaborator } = useViewStore();
  const viewIsShared = view === View.Shared;
  const [columns, todos] = viewIsShared
    ? [sharedColumns, sharedTodos]
    : [regularColumns, regularTodos];

  const [showFinalizeAlert, setShowFinalizeAlert] = useState(false);
  const [showShareAlert, setShowShareAlert] = useState(false);
  const [showNoTodosSelectedAlert, setShowNoTodosSelectedAlert] =
    useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();

  function updateSharedTodos(todosToShare: Todo[], sharedWithEmail: string) {
    const updatedTodosToShare = todos.map((todo) => {
      return {
        ...todo,
        checked: false,
        shared: true,
        sharedWithEmail,
      };
    });

    const newSharedTodos = sharedTodos.concat(updatedTodosToShare);

    setTodos(true, newSharedTodos);
  }

  function updateRegularTodos(todoToUnshare: Todo[]) {
    const updatedTodosToUnshare = todoToUnshare.map((todo) => {
      return {
        ...todo,
        checked: false,
        shared: false,
        sharedWithEmail: null,
      };
    });

    const newRegularTodos = regularTodos.concat(updatedTodosToUnshare);

    setTodos(false, newRegularTodos);
  }

  function removeTodosLocally() {
    const todosToRemove = getCheckedTodos(todos);
    removeTodosFromTodoOrder(
      columns,
      todosToRemove,
      viewIsShared,
      setTodoOrder,
      updateTodoPosition
    );
  }

  const shareTodos = trpc.todo.shareTodos.useMutation({
    onMutate: (data) => {
      removeTodosLocally();
      refreshLocalTodos(data.ids, setTodos, todos, viewIsShared);
      updateSharedTodos(getCheckedTodos(todos), data.sharedWithEmail);
    },
  });

  const unshareTodos = trpc.todo.unshareTodos.useMutation({
    onMutate: (data) => {
      removeTodosLocally();
      refreshLocalTodos(data.ids, setTodos, todos, viewIsShared);
      updateRegularTodos(getCheckedTodos(todos));
    },
  });

  useAlertEffect(showFinalizeAlert, setShowFinalizeAlert);
  useAlertEffect(showShareAlert, setShowShareAlert);
  useAlertEffect(showNoTodosSelectedAlert, setShowNoTodosSelectedAlert);

  const finalizeTodos = trpc.todo.finalizeTodos.useMutation({
    onMutate: (data) => {
      removeTodosLocally();
      refreshLocalTodos(data.ids, setTodos, todos, viewIsShared);
    },
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

  function handleUnShare() {
    const todoIdsToUnshare = getCheckedTodoIds(todos);
    setShowShareAlert(true);

    if (todoIdsToUnshare.length > 0) {
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
        onClick={() => handleShareButtonClicked()}
        className={buttonStyle}
      >
        {viewIsShared ? "UNSHARE" : <ShareIcon className="w-8 w-8" />}
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
        onAccept={viewIsShared ? handleUnShare : handleShare}
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
