import { type Todo } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import DroppableDayArea from "../components/droppableDayArea";
import SideNavigation from "../components/sideNavigation";
import Toolbar from "../components/toolbar";
import TopNaviagtion from "../components/topNavigation";
import useMarkedTodoStore from "../hooks/markedTodoStore";
import useTodoOrderStore from "../hooks/todoOrderStore";
import useTodoStore from "../hooks/todoStore";
import { Day } from "../types/enums";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  const todoQuery = trpc.todo.getTodos.useQuery();
  const todos = useMemo(() => todoQuery?.data ?? [], [todoQuery?.data]);
  const { todos: localTodos, setTodos: setLocalTodos } = useTodoStore();

  const { columns, setColumnTodoOrder } = useTodoOrderStore();

  const [searchValue, setSearchValue] = useState<string>("");
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

  const changeDay = trpc.todo.changeDayAfterDnD.useMutation({
    //! Refetching on success causes UI to flicker when two todos are moved shortly after each other
  });

  const reorder = (result: Todo[], startIndex: number, endIndex: number) => {
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
      result.splice(endIndex, 0, removed);
    }
    return result;
  };

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
          const todoToCheck = todos.find((todo) => todo.id === todo.id);
          //&& (todo.day !== col.id || todo.index !== index) better for performance? but doesnt work because of refetching todos
          if (todoToCheck) {
            console.log(todo.content);
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
      <Head>
        <title>My Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white">
          <TopNaviagtion />
          <div className="flex flex-col items-center gap-2 pt-5">
            <Toolbar
              refetch={todoQuery.refetch}
              setSearchValue={setSearchValue}
              todos={todos}
            />
            <div className="flex flex-row flex-wrap items-start justify-center gap-3">
              <DragDropContext onDragEnd={onDragEnd}>
                {(Object.keys(Day) as Array<keyof typeof Day>).map((day) => (
                  <DroppableDayArea
                    refetch={todoQuery.refetch}
                    searchValue={searchValue}
                    todos={localTodos.filter((todo) => todo.day === day)}
                    key={day}
                    day={day}
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
