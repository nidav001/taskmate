import { Transition } from "@headlessui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { type NextPage } from "next";
import { type CtxOrReq } from "next-auth/client/_utils";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { resetServerContext, type DropResult } from "react-beautiful-dnd";
import CollaboratorCombobox from "../components/shared/collaboratorComcobox";
import CustomHead from "../components/shared/customHead";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import Snackbar from "../components/shared/snackbar";
import SearchBar from "../components/todoPage/searchBar";
import TodoViewBase from "../components/todoPage/todoViewBase";
import Toolbar from "../components/todoPage/toolbar";
import useColumnStore from "../hooks/columnStore";
import useSearchStore from "../hooks/searchStore";
import useTodoStore from "../hooks/todoStore";
import useViewStore from "../hooks/viewStore";
import serverProps from "../lib/serverProps";
import { SnackbarCheckIcon } from "../resources/icons";
import { basicIcon, gradientTextStyle, zoomIn } from "../styles/basicStyles";
import { slideIn, slideInSharedView } from "../styles/transitionClasses";
import { View } from "../types/enums";
import { handleDragEnd } from "../utils/dragAndDrop";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  // Own Todos
  const openTodosQuery = trpc.todo.getOpenTodos.useQuery();
  const { view, setView, currentCollaborator } = useViewStore();
  const { regularColumns, sharedColumns, setTodoOrder } = useColumnStore();
  const { regularTodos, sharedTodos, setTodos } = useTodoStore();
  const session = useSession();
  const { search } = useSearchStore();

  const sharedTodosQuery = trpc.todo.getSharedTodos.useQuery({
    sharedEmail: currentCollaborator,
  });

  const sharedTodosFromDb = useMemo(
    () => sharedTodosQuery?.data ?? [],
    [sharedTodosQuery?.data]
  );

  const openTodosFromDb = useMemo(
    () => openTodosQuery?.data ?? [],
    [openTodosQuery?.data]
  );

  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();

  const [showAlert, setShowAlert] = useState(false);

  const isSharedView = view === View.Shared;

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

  function onDragEnd(result: DropResult, shared: boolean) {
    return handleDragEnd(
      result,
      shared,
      shared ? sharedColumns : regularColumns,
      shared ? sharedTodos : regularTodos,
      setTodoOrder,
      shared ? sharedTodos : regularTodos,
      setTodos,
      updateTodoPosition
    );
  }

  const TodoView = (
    <TodoViewBase
      onDragEnd={(res) => onDragEnd(res, false)}
      search={search}
      selectedCollaborator={currentCollaborator}
      isSharedTodosView={isSharedView}
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
      isSharedTodosView={isSharedView}
      isLoading={sharedTodosQuery.isLoading}
      todos={sharedTodos}
      refetch={sharedTodosQuery.refetch}
    />
  );

  const viewIsShared = view === View.Shared;

  return (
    <>
      <CustomHead title="Todos" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex flex-col items-center gap-4 pt-5">
            <div className="flex w-full items-center justify-evenly">
              <button
                type="button"
                onClick={() => setView(View.Regular)}
                className={classNames(
                  zoomIn,
                  "rounded-full bg-gray-100 p-2 hover:bg-gray-200 active:bg-gray-300"
                )}
              >
                <ArrowLeftIcon className={classNames(basicIcon, zoomIn)} />
              </button>
              <h1 className={classNames(gradientTextStyle, "text-2xl")}>
                {viewIsShared ? "Geteilte Todos" : "Deine Todos"}
              </h1>
              <button
                type="button"
                onClick={() => setView(View.Shared)}
                className={classNames(
                  zoomIn,
                  "rounded-full bg-gray-100 p-2 hover:bg-gray-200 active:bg-gray-300"
                )}
                disabled={viewIsShared}
              >
                <ArrowRightIcon className={classNames(basicIcon)} />
              </button>
            </div>
            <SearchBar />
            {isSharedView ? <CollaboratorCombobox /> : null}

            <Toolbar />

            <Transition show={!isSharedView} {...slideIn}>
              {!isSharedView ? TodoView : null}
            </Transition>
            <Transition show={isSharedView} {...slideInSharedView}>
              {isSharedView ? SharedTodoView : null}
            </Transition>
            <Snackbar
              message={`Todo geteilt mit ${currentCollaborator}. Sieh's dir an ➡️`}
              showAlert={showAlert}
              icon={<SnackbarCheckIcon />}
            />
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
