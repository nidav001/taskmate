import { type Todo } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  type DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
import DraggableTodoCard from "../components/draggableTodoCard";
import Navigation from "../components/navigation";
import TopNaviagtion from "../components/topNavigation";
import { Days } from "../types/days";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  const todos = trpc.todo.getTodos.useQuery();
  const finalizedTodos = trpc.todo.getFinalizedTodos.useQuery();
  const archivedTodos = trpc.todo.getArchivedTodos.useQuery();

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

  const [searchValue, setSearchValue] = useState<string>("");

  const reorder = (list: Todo[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
      result.splice(endIndex, 0, removed);
    }

    return result;
  };

  const [items, setItems] = useState<Todo[]>(todos?.data ?? []);

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "",
    width: 250,
  });

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const localItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(localItems);
  }

  const getItemStyle = (
    draggableStyle: DraggableProvidedDraggableProps,
    isDragging: boolean
  ) => ({
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const DroppableDayArea: React.FC<{ day: string }> = ({ day }) => {
    return (
      <Droppable key={day} droppableId={day}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={getListStyle(snapshot.isDraggingOver)}
            className="w-full"
          >
            <h1 className="text-xl font-bold">{day}</h1>
            <div className="flex w-full flex-col items-center gap-2 py-4">
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
                  <DraggableTodoCard index={index} key={todo.id} todo={todo} />
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
