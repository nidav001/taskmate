import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import DroppableDayArea from "../components/droppableDayArea";
import SideNavigation from "../components/sideNavigation";
import TodoButtons from "../components/todoButtons";
import TopNaviagtion from "../components/topNavigation";
import useMarkedTodoStore from "../hooks/markedTodoStore";
import useTodoOrderStore from "../hooks/todoOrderStore";
import { Days } from "../types/enums";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  const todoQuery = trpc.todo.getTodos.useQuery();
  const todos = useMemo(() => todoQuery?.data ?? [], [todoQuery]);

  const { columns, setColumnTodoOrder } = useTodoOrderStore();

  const [searchValue, setSearchValue] = useState<string>("");
  const { resetMarkedTodos } = useMarkedTodoStore();

  useEffect(() => {
    initializeTodoOrder();
  }, [todos]);

  const initializeTodoOrder = () => {
    columns.map((col) => {
      const columnTodos = todos
        .filter((todo) => todo.day === col.id)
        .map((todo) => todo.id);

      if (columnTodos.length > 0 && col.todoOrder.length === 0) {
        setColumnTodoOrder(col.id, columnTodos);
      }
    });
  };

  useEffect(() => {
    resetMarkedTodos();
  }, []);

  const changeDay = trpc.todo.changeDayAfterDnD.useMutation({
    onSuccess: () => {
      todoQuery.refetch();
    },

    //Display changes immediately, before the server responds
    onMutate(data) {
      todoQuery?.data?.forEach((todo) => {
        if (todo.id === data.result.draggableId) {
          todo.day = data.result.destination.droppableId as Days;
        }
      });
    },
  });

  const reorder = (result: string[], startIndex: number, endIndex: number) => {
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

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns?.find((col) => col.id === source.droppableId);
    const finish = columns?.find((col) => col.id === destination.droppableId);

    if (start && finish && start === finish) {
      console.log(
        "🚀 ~ file: todos.tsx ~ line 75 ~ onDragEnd ~ start?.todoOrder",
        start?.todoOrder
      );

      const newTodoOrder = reorder(
        start?.todoOrder ?? [],
        source.index,
        destination.index
      );
      console.log(
        "🚀 ~ file: todos.tsx ~ line 82 ~ onDragEnd ~ newTodoOrder",
        newTodoOrder
      );

      setColumnTodoOrder(start.id, newTodoOrder);

      resetMarkedTodos();
      return;
    }
    //Persist changes in database (onMutation will display changes immediately)
    changeDay.mutate({
      id: draggableId,
      day: destination.droppableId,
      result: result,
    });
  }

  return (
    <>
      <Head>
        <title>My Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="w-full bg-light">
          <TopNaviagtion />
          <div className="flex flex-col items-center gap-2 pt-5">
            <TodoButtons
              refetch={todoQuery.refetch}
              setSearchValue={setSearchValue}
              todos={todos}
            />
            <div className="flex flex-row flex-wrap items-start justify-center gap-3">
              <DragDropContext onDragEnd={onDragEnd}>
                {(Object.keys(Days) as Array<keyof typeof Days>).map((day) => (
                  <DroppableDayArea
                    refetch={todoQuery.refetch}
                    searchValue={searchValue}
                    todos={todos}
                    key={day}
                    day={day}
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
