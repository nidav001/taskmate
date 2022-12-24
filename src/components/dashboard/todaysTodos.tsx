import { type Todo } from "@prisma/client";
import { DateTime } from "luxon";
import useColumnStore from "../../hooks/columnStore";
import { sortTodos } from "../../utils/todoUtils";
import TodoCard from "../shared/todoCard";

type TodaysTodosProps = {
  todos: Todo[];
};

export default function TodaysTodos({ todos }: TodaysTodosProps) {
  const todaysDate = new Date().toLocaleDateString();
  const weekday = DateTime.now().weekdayLong;

  const filteredTodos = () => {
    return todos.filter((todo) => todo.day === weekday);
  };

  const getFilteredAndSortedTodos = () => {
    return sortTodos(filteredTodos(), todoOrder);
  };

  //Maybe use day as prop
  const todoOrder =
    useColumnStore((state) => state.columns).find(
      (col) => col.id === filteredTodos()[0]?.day
    )?.todoOrder ?? [];

  return (
    <div className="flex w-full flex-col items-center px-5 pt-5">
      <h2 className="text-xl font-bold dark:text-white">Heutige Todos</h2>
      <div className="dark:text-slate-400">{todaysDate}</div>
      <div className="flex flex-col pt-2">
        {getFilteredAndSortedTodos().map((todo) => (
          <TodoCard
            isDragging={false}
            todoDone={todo.done}
            key={todo.id}
            todo={todo}
          />
        ))}
      </div>
    </div>
  );
}
