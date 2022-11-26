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
        .map((todo) => todo.id);

      if (columnTodos.length !== col.todoOrder.length) {
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

    //If dropped in same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns.find((col) => col.id === source.droppableId);
    const finish = columns.find((col) => col.id === destination.droppableId);

    if (start && finish) {
      const startTodoIds = start.todoOrder;
      const finishTodoIds = finish.todoOrder;

      //reorder in same column
      if (start === finish) {
        const newTodoOrder = reorder(
          start?.todoOrder ?? [],
          source.index,
          destination.index
        );

        setColumnTodoOrder(start.id, newTodoOrder);

        resetMarkedTodos();
        return;
      }

      //reorder in different column
      startTodoIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTodoIds,
      };

      finishTodoIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTodoIds,
      };

      const newTodos = [...localTodos];
      const todoIndex = newTodos.findIndex((todo) => todo.id === draggableId);

      newTodos[todoIndex].day = destination.droppableId as Day;
      setLocalTodos(newTodos);

      setColumnTodoOrder(newStart.id, newStart.taskIds);
      setColumnTodoOrder(newFinish.id, newFinish.taskIds);

      // Persist changes in database (onMutate will display changes immediately)
      changeDay.mutate({
        id: draggableId,
        day: destination.droppableId,
        result: result,
      });
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
        <main className="w-full bg-light">
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
