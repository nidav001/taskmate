import { type Todo } from "@prisma/client";
import { DateTime } from "luxon";
import { type NextPage } from "next";
import { type CtxOrReq } from "next-auth/client/_utils";
import { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  resetServerContext,
  type DropResult,
} from "react-beautiful-dnd";
import Head from "../components/shared/head";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import DroppableDayArea from "../components/todoPage/droppableDayArea";
import SearchBar from "../components/todoPage/searchBar";
import Toolbar from "../components/todoPage/toolbar/toolbar";
import useMarkedTodoStore from "../hooks/markedTodoStore";
import useTodoOrderStore from "../hooks/todoOrderStore";
import useTodoStore from "../hooks/todoStore";
import serverProps from "../lib/serverProps";
import { trpc } from "../utils/trpc";

const dayNumbers = Array.from({ length: 7 }, (_, i) => i + 1);
const startOfWeek = DateTime.now().startOf("week");
const datesOfWeek = Array.from({ length: 7 }, (_, i) =>
  startOfWeek.plus({ days: i }).toLocaleString()
);

const Todos: NextPage = () => {
  const todoQuery = trpc.todo.getTodos.useQuery();
  const todos = useMemo(() => todoQuery?.data ?? [], [todoQuery?.data]);
  const { todos: localTodos, setTodos: setLocalTodos } = useTodoStore();

  const { columns, setColumnTodoOrder } = useTodoOrderStore();

  const [search, setSearch] = useState<string>("");
  const { resetMarkedTodos } = useMarkedTodoStore();

  useEffect(() => {
    validateColumnTodoOrders();
    setLocalTodos(todos);
  }, [todos]);

  const validateColumnTodoOrders = () => {
    columns.map((col) => {
      const columnTodos = todos
        .filter((todo) => todo.day === col.id)
        .sort((a, b) => a.index - b.index);

      setColumnTodoOrder(col.id, columnTodos);
    });
  };

  useEffect(() => {
    resetMarkedTodos();
  }, []);

  const changeDay = trpc.todo.changeDayAfterDnD.useMutation();

  const reorder = (result: Todo[], startIndex: number, endIndex: number) => {
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
      result.splice(endIndex, 0, removed);
    }
    return result;
  };

  function onDragEnd(result: DropResult) {
    console.log("🚀 ~ file: todos.tsx:69 ~ onDragEnd ~ result", result);
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

    const start = columns.find((col) => col.id === Number(source.droppableId));
    const finish = columns.find((col) => {
      return col.id === Number(destination.droppableId);
    });
    const draggedItem = todos.find((todo) => todo.id === draggableId);

    if (start && finish && draggedItem) {
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
          const todoToCheck = todos.find((todo1) => todo.id === todo1.id);
          //&& (todo.day !== col.id || todo.index !== index) better for performance? but doesnt work because of refetching todos
          if (
            todoToCheck &&
            (todoToCheck.day !== col.id || todoToCheck.index !== index)
          ) {
            console.log(
              todoToCheck.day +
                " " +
                col.id +
                "= " +
                (todoToCheck.day !== col.id) +
                " " +
                todoToCheck.content
            );
            changeDay.mutate({
              id: todo.id,
              day: col.id,
              index: index,
            });
          }
        });
      });

      resetMarkedTodos();
    }
  }

  return (
    <>
      <Head title="Todos" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white">
          <TopNaviagtion />
          <div className="flex flex-col items-center gap-8 pt-5">
            <SearchBar setSearch={setSearch} />
            <Toolbar refetch={todoQuery.refetch} todos={todos} />
            <div className="flex flex-row flex-wrap items-start justify-center gap-3">
              <DragDropContext onDragEnd={onDragEnd}>
                {dayNumbers.map((day) => (
                  <DroppableDayArea
                    date={datesOfWeek[day - 1] ?? "Framstag"}
                    refetch={todoQuery.refetch}
                    searchValue={search}
                    todos={localTodos.filter((todo) => todo.day === day)}
                    key={day}
                    dayNumber={day}
                    isLoading={todoQuery.isLoading}
                  />
                ))}
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
