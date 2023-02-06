import { type Todo } from "@prisma/client";
import { type DropResult } from "react-beautiful-dnd";
import { type Column } from "../types/column";
import { type Day } from "../types/enums";
import { persistTodoOrderInDb } from "./todoUtils";

function reorder(result: Todo[], startIndex: number, endIndex: number) {
  const [removed] = result.splice(startIndex, 1);
  if (removed) {
    result.splice(endIndex, 0, removed);
  }
  return result;
}

export function handleDragEnd(
  result: DropResult,
  columns: Column[],
  todosFromDb: Todo[],
  setColumnTodoOrder: (columnId: Day, todos: Todo[]) => void,
  localTodos: Todo[],
  setLocalTodos: (todos: Todo[]) => void
) {
  const { destination, source, draggableId } = result;

  // If dropped outside list or dropped in same place
  if (!destination) return;

  // If dropped in same place
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
  persistTodoOrderInDb(columns, updateTodoPosition);
}
