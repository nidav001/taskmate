import { Transition } from "@headlessui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { type NextPage } from "next";
import { type CtxOrReq } from "next-auth/client/_utils";
import React, { useEffect, useMemo } from "react";
import { DropResult, resetServerContext } from "react-beautiful-dnd";
import CollaboratorCombobox from "../components/shared/collaboratorComcobox";
import CustomHead from "../components/shared/customHead";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import SearchBar from "../components/todoPage/searchBar";
import TodoViewBase from "../components/todoPage/todoViewBase";
import Toolbar from "../components/todoPage/toolbar";
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
  zoomIn,
} from "../styles/basicStyles";
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
  const { search } = useSearchStore();

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

  const switchViewButton = (viewForButton: View) => {
    return (
      <button
        type="button"
        onClick={() => setView(viewForButton)}
        className={classNames(
          viewForButton === view
            ? disabledButtonStyle
            : classNames(buttonStyle, zoomIn),
        )}
        disabled={viewForButton === view}
      >
        {viewForButton === View.Shared ? (
          <ArrowRightIcon className={classNames(basicIcon)} />
        ) : (
          <ArrowLeftIcon
            className={classNames(
              basicIcon,
              viewForButton === view ? "" : zoomIn,
            )}
          />
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

  const MemoizedSideNavigation = React.memo(SideNavigation);
  const MemoizedTopNavigation = React.memo(TopNaviagtion);
  const MemoizedToolbar = React.memo(Toolbar);

  return (
    <>
      <CustomHead title="Todos" />
      <div className="flex h-full min-h-screen flex-row">
        <MemoizedSideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <MemoizedTopNavigation />
          <div className="flex flex-col items-center gap-4 pt-10">
            <div className="grid w-full grid-cols-10 items-center gap-2 px-5 2xl:grid-cols-4">
              <div className="flex justify-center">
                {switchViewButton(View.Regular)}
              </div>

              <div className="col-span-8 2xl:col-span-2">
                <div className="flex justify-center">{heading}</div>
              </div>
              <div className="flex justify-center">
                {switchViewButton(View.Shared)}
              </div>
            </div>
            <MemoizedToolbar />
            <div className="items-top flex max-w-md flex-col justify-center gap-2 px-5 lg:max-w-2xl lg:flex-row lg:px-0">
              <SearchBar />

              {isSharedView ? <CollaboratorCombobox /> : null}
            </div>
            <Transition show={!isSharedView} {...slideIn}>
              {!isSharedView ? TodoView : null}
            </Transition>
            <Transition show={isSharedView} {...slideInSharedView}>
              {isSharedView ? SharedTodoView : null}
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
