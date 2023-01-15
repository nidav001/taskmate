import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import classNames from "classnames";
import { DateTime } from "luxon";
import { type NextPage } from "next";
import { type CtxOrReq } from "next-auth/client/_utils";
import { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  resetServerContext,
  type DropResult,
} from "react-beautiful-dnd";
import GenericCombobox from "../components/addTodo/dayCombobox";
import CustomHead from "../components/shared/customHead";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import DroppableDayArea from "../components/todoPage/droppableDayArea";
import SearchBar from "../components/todoPage/searchBar";
import Toolbar from "../components/todoPage/toolbar";
import useColumnStore from "../hooks/columnStore";
import useOpenTodoStore from "../hooks/openTodoStore";
import useSearchStore from "../hooks/searchStore";
import useSharedTodoStore from "../hooks/sharedTodoStore";
import serverProps from "../lib/serverProps";
import { basicIcon, zoomIn } from "../styles/basicStyles";
import { Day } from "../types/enums";
import { persistTodoOrderInDb } from "../utils/todoUtils";
import { trpc } from "../utils/trpc";

const startOfWeek = DateTime.now().startOf("week");
const datesOfWeek = Array.from({ length: 7 }, (_, i) =>
  startOfWeek.plus({ days: i })
);

const Todos: NextPage = () => {
  const openTodosQuery = trpc.todo.getOpenTodos.useQuery();
  const openTodosFromDb = useMemo(
    () => openTodosQuery?.data ?? [],
    [openTodosQuery?.data]
  );

  const sharedTodosQuery = trpc.todo.getSharedTodos.useQuery();
  const sharedTodosFromDb = useMemo(
    () => sharedTodosQuery?.data ?? [],
    [sharedTodosQuery?.data]
  );

  const { todos: localSharedTodos, setTodos: setLocalSharedTodos } =
    useSharedTodoStore();

  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();

  const { todos: localTodos, setTodos: setLocalTodos } = useOpenTodoStore();
  const { columns, setColumnTodoOrder } = useColumnStore();

  const { search } = useSearchStore();

  const [showSharedTodos, setShowSharedTodos] = useState(false);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState<
    string | undefined
  >(undefined);

  const validateColumnTodoOrders = () => {
    columns.map((col) => {
      const columnTodos = openTodosFromDb
        .filter((todo) => todo.day === col.id)
        .sort((a, b) => a.index - b.index);

      setColumnTodoOrder(col.id, columnTodos);
    });
  };

  useEffect(() => {
    validateColumnTodoOrders();
    setLocalTodos(openTodosFromDb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTodosFromDb]);

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

  const TodoView = () => {
    const isLoading = showSharedTodos
      ? openTodosQuery.isLoading
      : sharedTodosQuery.isLoading;
    const refetch = showSharedTodos
      ? openTodosQuery.refetch
      : sharedTodosQuery.refetch;
    const todos = showSharedTodos ? localTodos : localSharedTodos;

    return (
      <div
        className={classNames(
          "flex flex-row flex-wrap items-start justify-center gap-3",
          showSharedTodos && selectedCollaborateur === undefined ? "hidden" : ""
        )}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {(Object.keys(Day) as Array<keyof typeof Day>).map((day, index) => (
            <DroppableDayArea
              date={
                datesOfWeek[index - 1] ??
                `Woche ${DateTime.now().weekNumber.toString()}`
              }
              refetch={refetch}
              searchValue={search}
              todos={todos.filter((todo) => todo.day === day)}
              key={day}
              day={day as Day}
              isLoading={isLoading}
            />
          ))}
        </DragDropContext>
      </div>
    );
  };

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
                "flex justify-center",
                !showSharedTodos ? "hidden" : ""
              )}
            >
              <GenericCombobox
                selected={selectedCollaborateur}
                setSelected={setSelectedCollaborateur}
                comboboxOptions={["Niklas"]}
              />
            </div>
            <SearchBar />
            <Toolbar refetch={() => openTodosQuery.refetch()} />

            <TodoView />
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
