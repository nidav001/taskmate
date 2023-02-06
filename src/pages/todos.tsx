import { Transition } from "@headlessui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { type NextPage } from "next";
import { type CtxOrReq } from "next-auth/client/_utils";
import { useEffect, useMemo, useState } from "react";
import { resetServerContext, type DropResult } from "react-beautiful-dnd";
import CustomHead from "../components/shared/customHead";
import GenericCombobox from "../components/shared/genericCombobox";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import SearchBar from "../components/todoPage/searchBar";
import TodoViewBase from "../components/todoPage/todoViewBase";
import Toolbar from "../components/todoPage/toolbar";
import useColumnStore from "../hooks/columnStore";
import useSearchStore from "../hooks/searchStore";
import useTodoStore from "../hooks/todoStore";
import serverProps from "../lib/serverProps";
import { basicIcon, zoomIn } from "../styles/basicStyles";
import { slideIn, slideInSharedView } from "../styles/transitionClasses";
import { handleDragEnd } from "../utils/dragAndDrop";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  // Own Todos
  const openTodosQuery = trpc.todo.getOpenTodos.useQuery();

  const openTodosFromDb = useMemo(
    () => openTodosQuery?.data ?? [],
    [openTodosQuery?.data]
  );

  const [selectedCollaborator, setSelectedCollaborator] = useState<string>("");

  const sharedTodosQuery = trpc.todo.getSharedTodos.useQuery({
    sharedWithEmail: selectedCollaborator,
  });

  const sharedTodosFromDb = useMemo(
    () => sharedTodosQuery?.data ?? [],
    [sharedTodosQuery?.data]
  );

  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();

  const { regularColumns, sharedColumns, setTodoOrder } = useColumnStore();
  const { regularTodos, sharedTodos, setTodos } = useTodoStore();

  const collaboratorEmails = [
    ...new Set(
      (trpc.todo.getCollaborators.useQuery().data ?? [])?.map(
        (c) => c.sharedWithEmail
      ) ?? []
    ),
  ];

  const [showSharedTodos, setShowSharedTodos] = useState(false);

  // General
  const { search } = useSearchStore();

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
      selectedCollaborator={selectedCollaborator}
      isSharedTodosView={showSharedTodos}
      isLoading={openTodosQuery.isLoading}
      todos={regularTodos}
      refetch={openTodosQuery.refetch}
    />
  );

  const SharedTodoView = (
    <TodoViewBase
      onDragEnd={(res) => onDragEnd(res, true)}
      search={search}
      selectedCollaborator={selectedCollaborator}
      isSharedTodosView={showSharedTodos}
      isLoading={sharedTodosQuery.isLoading}
      todos={sharedTodos}
      refetch={sharedTodosQuery.refetch}
    />
  );

  return (
    <>
      <CustomHead title="Todos" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex flex-col items-center gap-8 pt-5">
            <div className="flex w-full items-center justify-evenly">
              <button
                type="button"
                onClick={() => setShowSharedTodos(false)}
                className={classNames(
                  zoomIn,
                  "rounded-full bg-gray-100 p-2 hover:bg-gray-200 active:bg-gray-300"
                )}
              >
                <ArrowLeftIcon className={classNames(basicIcon, zoomIn)} />
              </button>
              <h1>{showSharedTodos ? "Geteilte Todos" : "Deine Todos"}</h1>
              <button
                type="button"
                onClick={() => setShowSharedTodos(true)}
                className={classNames(
                  zoomIn,
                  "rounded-full bg-gray-100 p-2 hover:bg-gray-200 active:bg-gray-300"
                )}
              >
                <ArrowRightIcon className={classNames(basicIcon)} />
              </button>
            </div>
            <div
              className={classNames(
                "flex w-full max-w-2xl justify-center gap-2 px-2"
              )}
            >
              <GenericCombobox
                sharedView={showSharedTodos}
                show={showSharedTodos}
                selected={selectedCollaborator}
                setSelected={setSelectedCollaborator}
                comboboxOptions={collaboratorEmails}
              />
              <SearchBar sharedView={showSharedTodos} />
            </div>

            <Toolbar refetch={() => openTodosQuery.refetch()} />

            <Transition show={!showSharedTodos} {...slideIn}>
              {!showSharedTodos ? TodoView : null}
            </Transition>
            <Transition show={showSharedTodos} {...slideInSharedView}>
              {showSharedTodos ? SharedTodoView : null}
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
