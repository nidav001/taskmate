import { type Todo } from "@prisma/client";
import { type Column } from "../types/column";
import { type Day } from "../types/enums";

export function sortTodos(todos: Todo[], todoOrder: Todo[]) {
  return todos.sort((a, b) => {
    const aIndex = todoOrder.findIndex((todo) => todo.id === a.id);
    const bIndex = todoOrder.findIndex((todo) => todo.id === b.id);
    return aIndex - bIndex;
  });
}

export function getCheckedTodoIds(todos: Todo[]) {
  return (
    todos?.filter((todo) => todo.checked === true).map((todo) => todo.id) ?? []
  );
}

export function getCheckedTodos(todos: Todo[], ids: string[]) {
  return todos?.filter((todo) => ids.includes(todo.id)) ?? [];
}

export function refreshLocalTodos(
  ids: string[],
  setTodos: (todos: Todo[]) => void,
  todos: Todo[]
) {
  const newTodos = todos.filter((todo) => !ids.includes(todo.id));
  setTodos(newTodos);
}

export function persistTodoOrderInDb(columns: Column[], updateTodo: any) {
  columns.forEach((col) => {
    col.todoOrder.forEach((todo, index) => {
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

export function removeTodoFromTodoOrder(
  columns: Column[],
  todo: Todo,
  setColumnTodoOrder: (columnId: Day, newTodoOrder: Todo[]) => void,
  updateTodoPosition: any
) {
  const oldColumnTodoOrder = columns.find(
    (col) => col.id === todo.day
  )?.todoOrder;

  const newColumnTodoOrder = oldColumnTodoOrder?.splice(
    oldColumnTodoOrder.findIndex(
      (todoToCompare) => todoToCompare.id === todo.id
    ),
    1
  );

  setColumnTodoOrder(todo.day as Day, newColumnTodoOrder ?? []);
  persistTodoOrderInDb(columns, updateTodoPosition);
}
