import { Transition } from "@headlessui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
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
import useOpenTodoStore from "../hooks/openTodoStore";
import useSearchStore from "../hooks/searchStore";
import useSharedColumnStore from "../hooks/sharedColumnStore";
import useSharedTodoStore from "../hooks/sharedTodoStore";
import serverProps from "../lib/serverProps";
import { basicIcon, zoomIn } from "../styles/basicStyles";
import { slideIn, slideInSharedView } from "../styles/transitionClasses";
import { type Column } from "../types/column";
import { type Day } from "../types/enums";
import { persistTodoOrderInDb } from "../utils/todoUtils";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  //Own Todos
  const openTodosQuery = trpc.todo.getOpenTodos.useQuery();

  const openTodosFromDb = useMemo(
    () => openTodosQuery?.data ?? [],
    [openTodosQuery?.data]
  );
  const { todos: localTodos, setTodos: setLocalTodos } = useOpenTodoStore();

  const { columns, setColumnTodoOrder } = useColumnStore();

  //Shared Todos
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>("");

  const sharedTodosQuery = trpc.todo.getSharedTodos.useQuery({
    sharedWithEmail: selectedCollaborator,
  });

  const sharedTodosFromDb = useMemo(
    () => sharedTodosQuery?.data ?? [],
    [sharedTodosQuery?.data]
  );

  const collaboratorsQuery = trpc.todo.getCollaborators.useQuery();

  const collaboratorsEmails = useMemo(
    () =>
      collaboratorsQuery?.data.map(
        (collaborator) => collaborator.sharedWithEmail
      ) ?? [],
    [collaboratorsQuery?.data]
  );

  const { todos: localSharedTodos, setTodos: setLocalSharedTodos } =
    useSharedTodoStore();

  const { sharedColumns, setSharedColumnTodoOrder } = useSharedColumnStore();

  const [showSharedTodos, setShowSharedTodos] = useState(false);

  //General
  const { search } = useSearchStore();

  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();

  function validateColumnTodoOrder(
    columns: Column[],
    todos: Todo[],
    shared: boolean,
    setColumnTodoOrder: (id: Day, todos: Todo[]) => void
  ) {
    columns.map((col) => {
      const columnTodos = todos
        .filter((todo) => todo.shared === shared && todo.day === col.id)
        .sort((a, b) => a.index - b.index);

      setColumnTodoOrder(col.id, columnTodos);
    });
  }

  useEffect(() => {
    validateColumnTodoOrder(
      columns,
      openTodosFromDb,
      false,
      setColumnTodoOrder
    );
    setLocalTodos(openTodosFromDb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTodosFromDb]);

  useEffect(() => {
    validateColumnTodoOrder(
      sharedColumns,
      sharedTodosFromDb,
      true,
      setSharedColumnTodoOrder
    );
    setLocalSharedTodos(sharedTodosFromDb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedTodosFromDb]);

  function reorder(result: Todo[], startIndex: number, endIndex: number) {
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
      result.splice(endIndex, 0, removed);
    }
    return result;
  }

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    //If dropped outside list or dropped in same place
    if (!destination) return;

    //If dropped in same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns.find((col) => col.id === source.droppableId);
    const finish = columns.find((col) => col.id === destination.droppableId);
    const draggedItem = openTodosFromDb.find((todo) => todo.id === draggableId);

    if (!start || !finish || !draggedItem) return;

    if (start === finish) {
      // Reorder in same column
      const newTodoOrder = reorder(
        start.todoOrder,
        source.index,
        destination.index
      );

      setColumnTodoOrder(start.id, newTodoOrder);
    } else {
      // Reorder in different column
      start.todoOrder.splice(source.index, 1);
      const newStart = {
        ...start,
        todos: start.todoOrder,
      };

      finish.todoOrder.splice(destination.index, 0, draggedItem);
      const newFinish = {
        ...finish,
        todos: finish.todoOrder,
      };

      const newTodos = [...localTodos];
      newTodos.splice(
        newTodos.findIndex((todo) => todo.id === draggedItem.id),
        1,
        {
          ...draggedItem,
          day: newFinish.id,
        }
      );
      setLocalTodos(newTodos);

      setColumnTodoOrder(newStart.id, newStart.todos);
      setColumnTodoOrder(newFinish.id, newFinish.todos);
    }

    persistTodoOrderInDb(columns, updateTodoPosition);
  }

  const TodoView = (
    <TodoViewBase
      onDragEnd={onDragEnd}
      search={search}
      selectedCollaborator={selectedCollaborator}
      showSharedTodos={showSharedTodos}
      isLoading={openTodosQuery.isLoading}
      todos={localTodos}
      refetch={openTodosQuery.refetch}
    />
  );

  const SharedTodoView = (
    <TodoViewBase
      onDragEnd={onDragEnd}
      search={search}
      selectedCollaborator={selectedCollaborator}
      showSharedTodos={showSharedTodos}
      isLoading={sharedTodosQuery.isLoading}
      todos={localSharedTodos}
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
                comboboxOptions={collaboratorsEmails}
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
