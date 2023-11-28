import { Transition } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import classNames from "classnames";
import { type NextPage } from "next";
import { type CtxOrReq } from "next-auth/client/_utils";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { resetServerContext, type DropResult } from "react-beautiful-dnd";
import CollaboratorCombobox from "../components/shared/collaboratorComcobox";
import CustomHead from "../components/shared/customHead";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import SearchBar from "../components/todoPage/searchBar";
import TodoViewBase from "../components/todoPage/todoViewBase";
import useColumnStore from "../hooks/columnStore";
import useSearchStore from "../hooks/searchStore";
import useTodoStore from "../hooks/todoStore";
import useViewStore from "../hooks/viewStore";
import serverProps from "../lib/serverProps";
import {
  basicIcon,
  buttonStyle,
  disabledButtonStyle,
  gradientTextStyle,
} from "../styles/basicStyles";
import {
  slideIn,
  slideInSharedView,
  snackbar,
} from "../styles/transitionClasses";
import { View } from "../types/enums";
import { handleDragEnd } from "../utils/dragAndDrop";
import {
  getCheckedTodoIds,
  getCheckedTodos,
  removeTodosFromTodoOrder,
} from "../utils/todoUtils";
import { useAlertEffect } from "../utils/toolbarUtils";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  const openTodosQuery = trpc.todo.getOpenTodos.useQuery();
  const { view, setView, currentCollaborator } = useViewStore();
  const { regularColumns, sharedColumns, setTodoOrder } = useColumnStore();
  const { regularTodos, sharedTodos, setTodos } = useTodoStore();
  const { search } = useSearchStore();
  const viewIsShared = view === View.Shared;
  const [columns, currentTodos] = viewIsShared
    ? [sharedColumns, sharedTodos]
    : [regularColumns, regularTodos];

  const sharedTodosQuery = trpc.todo.getSharedTodos.useQuery({
    sharedEmail: currentCollaborator,
  });

  const sharedTodosFromDb = useMemo(
    () => sharedTodosQuery?.data ?? [],
    [sharedTodosQuery?.data],
  );

  const openTodosFromDb = useMemo(
    () => openTodosQuery?.data ?? [],
    [openTodosQuery?.data],
  );

  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();

  function validateColumnTodoOrder(shared: boolean) {
    const todos = shared ? sharedTodosFromDb : openTodosFromDb;
    const columnsToCheck = shared ? sharedColumns : regularColumns;
    columnsToCheck.forEach((col) => {
      const columnTodos = todos
        .filter((todo) => todo.shared === shared && todo.day === col.id)
        .sort((a, b) => a.index - b.index);

      setTodoOrder(shared, col.id, columnTodos);
    });
  }

  useEffect(() => {
    validateColumnTodoOrder(false);
    setTodos(false, openTodosFromDb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTodosFromDb]);

  useEffect(() => {
    validateColumnTodoOrder(true);
    setTodos(true, sharedTodosFromDb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedTodosFromDb]);

  const onDragEnd = useMemo(() => {
    return (result: DropResult, shared: boolean) => {
      handleDragEnd(
        result,
        shared,
        shared ? sharedColumns : regularColumns,
        shared ? sharedTodos : regularTodos,
        setTodoOrder,
        shared ? sharedTodos : regularTodos,
        setTodos,
        updateTodoPosition,
      );
    };
  }, [
    sharedColumns,
    sharedTodos,
    regularColumns,
    regularTodos,
    setTodoOrder,
    setTodos,
    updateTodoPosition,
  ]);

  const TodoView = (
    <TodoViewBase
      onDragEnd={(res) => onDragEnd(res, false)}
      search={search}
      selectedCollaborator={currentCollaborator}
      isSharedTodosView={viewIsShared}
      isLoading={openTodosQuery.isLoading}
      todos={regularTodos}
      refetch={openTodosQuery.refetch}
    />
  );

  const SharedTodoView = (
    <TodoViewBase
      onDragEnd={(res) => onDragEnd(res, true)}
      search={search}
      selectedCollaborator={currentCollaborator}
      isSharedTodosView={viewIsShared}
      isLoading={sharedTodosQuery.isLoading}
      todos={sharedTodos}
      refetch={sharedTodosQuery.refetch}
    />
  );

  const switchViewButton = (viewForButton: View) => {
    return (
      <button
        type="button"
        aria-label={`Switch view to ${viewForButton.toString()} todos`}
        onClick={() => setView(viewForButton)}
        className={classNames(
          viewForButton === view ? disabledButtonStyle : buttonStyle,
        )}
        disabled={viewForButton === view}
      >
        {viewForButton === View.Shared ? (
          <ArrowRightIcon className={classNames(basicIcon)} />
        ) : (
          <ArrowLeftIcon className={classNames(basicIcon)} />
        )}
      </button>
    );
  };

  const heading = (
    <h1
      className={classNames(
        gradientTextStyle,
        "flex h-20 items-center text-3xl lg:text-6xl",
      )}
    >
      {viewIsShared ? "Geteilte Todos" : "Deine Todos"}
    </h1>
  );

  const MemoizedTopNavigation = React.memo(TopNaviagtion);

  const {
    value: showNoTodosSelectedAlert,
    setValue: setShowNoTodosSelectedAlert,
  } = useAlertEffect();

  const { value: showFinalizeAlert, setValue: setShowFinalizeAlert } =
    useAlertEffect();

  const [showFinalizeTodoButton, setShowFinalizeTodoButton] = useState(
    getCheckedTodoIds(currentTodos).length > 0,
  );

  function updateTodoOrder() {
    const todosToRemove = getCheckedTodos(currentTodos);
    removeTodosFromTodoOrder(
      columns,
      todosToRemove,
      viewIsShared,
      setTodoOrder,
      updateTodoPosition,
    );
  }
  function refreshTodosInOtherView(sharedWithEmail: string) {
    const todoIsBeingUnShared = sharedWithEmail !== "";
    const updatedTodos = getCheckedTodos(currentTodos).map((todo) => {
      return {
        ...todo,
        checked: false,
        shared: !todo.shared,
        sharedWithEmail: todoIsBeingUnShared ? null : sharedWithEmail,
      };
    });

    const newTodos = (!viewIsShared ? sharedTodos : regularTodos).concat(
      updatedTodos,
    );

    setTodos(!viewIsShared, newTodos);
  }

  function removeTodosFromCurrentView(ids: string[]) {
    const newTodos = currentTodos.filter((todo) => !ids.includes(todo.id));
    setTodos(viewIsShared, newTodos);
  }

  function handleOnMutate(
    ids: string[],
    collaborator: string,
    isFinalizing = false,
  ) {
    updateTodoOrder();
    removeTodosFromCurrentView(ids);
    if (!isFinalizing) refreshTodosInOtherView(collaborator);
  }

  useEffect(() => {
    setShowFinalizeTodoButton(getCheckedTodoIds(currentTodos).length > 0);
  }, [currentTodos]);

  const finalizeTodos = trpc.todo.finalizeTodos.useMutation({
    onMutate: (data) => handleOnMutate(data.ids, "", true),
  });

  function handleOnClickFinalize() {
    const doneTodoIds = getCheckedTodoIds(currentTodos);

    if (doneTodoIds.length > 0) {
      setShowFinalizeAlert(true);
      finalizeTodos.mutate({
        ids: doneTodoIds,
      });
    } else {
      setShowNoTodosSelectedAlert(true);
    }
  }

  return (
    <>
      <CustomHead title="Todos" />
      <div className="flex h-full min-h-screen flex-row">
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <MemoizedTopNavigation />
          <div className="flex flex-col items-center gap-4 pt-10">
            {/* <div className="grid w-full grid-cols-10 items-center gap-2 px-5 2xl:grid-cols-4">
              <div className="flex justify-center">
                {viewIsShared && switchViewButton(View.Regular)}
              </div>

              <div className="col-span-8 2xl:col-span-2">
                <div className="flex justify-center">{heading}</div>
              </div>
              <div className="flex justify-center">
                {!viewIsShared && switchViewButton(View.Shared)}
              </div>
            </div> */}
            <div className="col-span-8 2xl:col-span-2">
              <div className="flex justify-center">{heading}</div>
            </div>
            {/* <Toolbar
              handleOnMutate={handleOnMutate}
              handleOnClickFinalize={() => handleOnClickFinalize()}
              showFinalizeAlert={showFinalizeAlert}
              setShowNoTodosSelectedAlert={setShowNoTodosSelectedAlert}
              showNoTodosSelectedAlert={showNoTodosSelectedAlert}
            /> */}
            <div className="items-top flex max-w-md flex-row items-center justify-center gap-2 px-5 lg:max-w-2xl lg:flex-row lg:px-0">
              <Link
                href="/addTodo"
                className={classNames(buttonStyle)}
                aria-label="Add todo"
              >
                <PlusIcon className={basicIcon} />
              </Link>
              <SearchBar />
              {viewIsShared && <CollaboratorCombobox />}
            </div>
            <div>
              <Transition show={!viewIsShared} {...slideIn}>
                {!viewIsShared ? TodoView : null}
              </Transition>
              <Transition show={viewIsShared} {...slideInSharedView}>
                {viewIsShared ? SharedTodoView : null}
              </Transition>
            </div>
            <Transition
              as="div"
              className="fixed bottom-2 left-0 right-0 z-50 mx-5 flex justify-center md:bottom-4"
              show={showFinalizeTodoButton}
              {...snackbar}
            >
              <button
                onClick={() => handleOnClickFinalize()}
                type="button"
                className={classNames(buttonStyle, "px-24 py-6")}
              >
                Todos sind fertig
              </button>
            </Transition>
          </div>
        </main>
      </div>
    </>
  );
};

export default Todos;

export async function getServerSideProps(context: CtxOrReq) {
  resetServerContext();
  return {
    ...(await serverProps(context)),
  };
}
