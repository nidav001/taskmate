import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";
import DraggableTodoCard from "../components/draggableTodoCard";
import SideNavigation from "../components/sideNavigation";
import TodoButtons from "../components/todoButtons";
import TopNaviagtion from "../components/topNavigation";
import useMarkedTodoStore from "../hoooks/markedTodoStore";
import { Days } from "../types/enums";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
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

  const [searchValue, setSearchValue] = useState<string>("");

  // const reorder = (list: Todo[], startIndex: number, endIndex: number) => {
  //   const result = Array.from(list);
  //   const [removed] = result.splice(startIndex, 1);
  //   if (removed) {
  //     result.splice(endIndex, 0, removed);
  //   }

  //   return result;
  // };

  function onDragEnd(result: DropResult) {
    //If dropped outside list or dropped in same place
    if (
      !result.destination ||
      result.destination.droppableId === result.source.droppableId
    ) {
      return;
    }

    changeDay.mutate({
      id: result.draggableId,
      day: result.destination.droppableId,
      result: result,
    });

    markedTodoStore.resetMarkedTodos();
  }

  const DroppableDayArea: React.FC<{ day: string }> = ({ day }) => {
    return (
      <Droppable key={day} droppableId={day}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-80"
          >
            <h1 className="text-xl font-bold">{day}</h1>
            <div className="flex flex-col py-4">
              {todos.data
                ?.filter(
                  (todo) =>
                    todo.day === day &&
                    todo.content
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                )
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                .sort((a, b) => (a.done === b.done ? 0 : b.done ? -1 : 1))
                .map((todo, index) => (
                  <DraggableTodoCard
                    refetch={todos.refetch}
                    index={index}
                    key={todo.id}
                    todo={todo}
                  />
                ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    );
  };

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
                  <DroppableDayArea key={day} day={day} />
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
