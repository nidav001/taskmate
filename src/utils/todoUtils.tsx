import { type Todo } from "@prisma/client";

export function sortTodos(todos: Todo[], todoOrder: Todo[]) {
  return todos.sort((a, b) => {
    const aIndex = todoOrder.findIndex((todo) => todo.id === a.id);
    const bIndex = todoOrder.findIndex((todo) => todo.id === b.id);
    return aIndex - bIndex;
  });
}
