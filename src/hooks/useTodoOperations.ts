import { type Todo } from "@prisma/client";
import { getCheckedTodos, removeTodosFromTodoOrder } from "../utils/todoUtils";
import { trpc } from "../utils/trpc";
import useColumnStore from "./columnStore";
import useTodoStore from "./todoStore";

export const useTodoOperations = (viewIsShared: boolean) => {
  const { setTodoOrder } = useColumnStore();
  const { setTodos } = useTodoStore();
  const updateTodoPosition = trpc.todo.updateTodoPosition.useMutation();

  const updateTodoOrder = (columns: any, todos: Todo[]) => {
    const todosToRemove = getCheckedTodos(todos);
    removeTodosFromTodoOrder(
      columns,
      todosToRemove,
      viewIsShared,
      setTodoOrder,
      updateTodoPosition,
    );
  };

  const removeTodosFromCurrentView = (todos: Todo[], ids: string[]) => {
    const newTodos = todos.filter((todo) => !ids.includes(todo.id));
    setTodos(viewIsShared, newTodos);
  };

  return {
    updateTodoOrder,
    removeTodosFromCurrentView,
  };
};
