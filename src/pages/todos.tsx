import { type Todo } from "@prisma/client";
import { DateTime } from "luxon";
import { type NextPage } from "next";
import { type CtxOrReq } from "next-auth/client/_utils";
import { useEffect, useMemo, useRef } from "react";
import {
  DragDropContext,
  resetServerContext,
  type DropResult,
} from "react-beautiful-dnd";
import CustomHead from "../components/shared/customHead";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import DroppableDayArea from "../components/todoPage/droppableDayArea";
import SearchBar from "../components/todoPage/searchBar";
import Toolbar from "../components/todoPage/toolbar";
import useColumnStore from "../hooks/columnStore";
import useSearchStore from "../hooks/searchStore";
import useTodoStore from "../hooks/todoStore";
import serverProps from "../lib/serverProps";
import { Day } from "../types/enums";
import { trpc } from "../utils/trpc";

const startOfWeek = DateTime.now().startOf("week");
const datesOfWeek = Array.from({ length: 7 }, (_, i) =>
  startOfWeek.plus({ days: i })
);

const Todos: NextPage = () => {
  const todoQuery = trpc.todo.getTodos.useQuery();
  const todosFromDb = useMemo(() => todoQuery?.data ?? [], [todoQuery?.data]);
  const updateTodo = trpc.todo.updateTodo.useMutation();
  const mostRecentTodo = trpc.todo.getMostRecentTodo.useQuery().data;

  const recentlyAddedTodo = useRef(null);
  const executeScroll = () =>
    recentlyAddedTodo.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

  useEffect(() => {
    if (recentlyAddedTodo.current) {
      executeScroll();
    }
    recentlyAddedTodo.current = null;
  }, [mostRecentTodo]);

  const { todos: localTodos, setTodos: setLocalTodos } = useTodoStore();
  const { columns, setColumnTodoOrder } = useColumnStore();

  const { search } = useSearchStore();

  const validateColumnTodoOrders = () => {
    columns.map((col) => {
      const columnTodos = todosFromDb
        .filter((todo) => todo.day === col.id)
        .sort((a, b) => a.index - b.index);

      setColumnTodoOrder(col.id, columnTodos);
    });
  };

  useEffect(() => {
    validateColumnTodoOrders();
    setLocalTodos(todosFromDb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todosFromDb]);

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
    const draggedItem = todosFromDb.find((todo) => todo.id === draggableId);

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

    // Persist changes in database based on local state
    columns.map((col) => {
      col.todoOrder.map((todo, index) => {
        if (todo.index !== index || todo.day !== col.id) {
          updateTodo.mutate({
            id: todo.id,
            day: col.id,
            index: index,
          });
        }
      });
    });
  }

  return (
    <>
      <CustomHead title="Todos" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex flex-col items-center gap-8 pt-5">
            <SearchBar />
            <Toolbar />
            <div className="flex flex-row flex-wrap items-start justify-center gap-3">
              <DragDropContext onDragEnd={onDragEnd}>
                {(Object.keys(Day) as Array<keyof typeof Day>).map(
                  (day, index) => (
                    <DroppableDayArea
                      todoRef={recentlyAddedTodo}
                      date={
                        datesOfWeek[index - 1] ??
                        `Woche ${DateTime.now().weekNumber.toString()}`
                      }
                      refetch={todoQuery.refetch}
                      searchValue={search}
                      todos={localTodos.filter((todo) => todo.day === day)}
                      key={day}
                      day={day as Day}
                      isLoading={todoQuery.isLoading}
                    />
                  )
                )}
              </DragDropContext>
            </div>
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
