import { Todo } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import DroppableDayArea from "../components/droppableDayArea";
import SideNavigation from "../components/sideNavigation";
import TodoButtons from "../components/todoButtons";
import TopNaviagtion from "../components/topNavigation";
import useMarkedTodoStore from "../hoooks/markedTodoStore";
import { Days } from "../types/enums";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const markedTodoStore = useMarkedTodoStore();

  useEffect(() => {
    markedTodoStore.resetMarkedTodos();
  }, []);

  const todos = trpc.todo.getTodos.useQuery();

  const changeDay = trpc.todo.changeDayAfterDnD.useMutation({
    onSuccess: () => {
      todos.refetch();
    },

    //Display changes immediately, before the server responds
    onMutate(data) {
      todos?.data?.forEach((todo) => {
        if (todo.id === data.result.draggableId) {
          todo.day = data.result.destination.droppableId as Days;
        }
      });
    },
  });

  const reorder = (list: Todo[], startIndex: number, endIndex: number) => {
    const [removed] = list.splice(startIndex, 1);
    if (removed) {
      list.splice(endIndex, 0, removed);
    }

    return list;
  };

  function onDragEnd(result: DropResult) {
    //If dropped outside list or dropped in same place
    if (!result.destination) return;

    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }

    //Persist changes in database (onMutation will display changes immediately)
    changeDay.mutate({
      id: result.draggableId,
      day: result.destination.droppableId,
      result: result,
    });

    markedTodoStore.resetMarkedTodos();
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
              refetch={todos.refetch}
              setSearchValue={setSearchValue}
              todos={todos.data}
            />
            <div className="flex flex-row flex-wrap items-start justify-center gap-3">
              <DragDropContext onDragEnd={onDragEnd}>
                {(Object.keys(Days) as Array<keyof typeof Days>).map((day) => (
                  <DroppableDayArea
                    refetch={todos.refetch}
                    searchValue={searchValue}
                    todos={todos.data ?? []}
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
