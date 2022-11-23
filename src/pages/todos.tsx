import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DraggableTodoCard from "../components/draggableTodoCard";
import Navigation from "../components/navigation";
import TopNaviagtion from "../components/topNavigation";
import { Days } from "../types/days";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  const todos = trpc.todo.getTodos.useQuery();

  const currentlyDoneTodoIds =
    todos?.data?.length && todos?.data?.length > 0
      ? todos?.data?.filter((todo) => todo.done).map((todo) => todo.id)
      : [];

  const currentlyNotDoneTodoIds =
    todos?.data?.length && todos?.data?.length > 0
      ? todos?.data?.filter((todo) => !todo.done).map((todo) => todo.id)
      : [];

  const finalizeTodos = trpc.todo.finalizeTodos.useMutation({
    onSuccess: () => {
      todos.refetch();
    },
  });

  const archiveTodos = trpc.todo.archiveTodos.useMutation({
    onSuccess: () => {
      todos.refetch();
    },
  });

  function handleOnClickFinalize() {
    finalizeTodos.mutate({
      ids: currentlyDoneTodoIds,
      done: true,
    });
  }

  function handleOnClickArchive() {
    handleOnClickFinalize();
    archiveTodos.mutate({
      ids: currentlyNotDoneTodoIds,
      done: true,
    });
  }

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

  function onDragEnd(result) {
    console.log("🚀 ~ file: todos.tsx ~ line 78 ~ onDragEnd ~ result", result);

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
  }

  const DroppableDayArea: React.FC<{ day: string }> = ({ day }) => {
    return (
      <Droppable key={day} droppableId={day}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-72"
          >
            <h1 className="text-xl font-bold">{day}</h1>
            <div className="flex w-full flex-col items-center py-4">
              {todos.data
                ?.filter(
                  (todo) =>
                    todo.day === day &&
                    todo.content
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                )
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                .sort((a, b) => (a.done === b.done ? 0 : a.done ? -1 : 1))
                .map((todo, index) => (
                  <DraggableTodoCard
                    todos={todos}
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
      <div className="flex flex-row">
        <Navigation />
        <main className="min-h-screen w-full bg-light lg:flex lg:flex-col">
          <TopNaviagtion />
          <div className="flex flex-col items-center gap-2 pt-5">
            <div className="flex flex-col items-center">
              <input
                type="text"
                className="w-50 rounded-xl"
                placeholder="Search..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleOnClickFinalize()}
                className="h-12 w-28 rounded-3xl bg-laccent p-2"
              >
                Finalisieren
              </button>
              <button
                onClick={() => handleOnClickArchive()}
                className="h-12 w-28 rounded-3xl bg-laccent p-2"
              >
                Neue Woche
              </button>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-6 pl-5 2xl:flex-row 2xl:items-start">
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
