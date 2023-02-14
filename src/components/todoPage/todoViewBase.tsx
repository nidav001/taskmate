import { type Todo } from "@prisma/client";
import classNames from "classnames";
import { DateTime } from "luxon";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { Day } from "../../types/enums";
import DroppableDayArea from "./droppableDayArea";

const startOfWeek = DateTime.now().startOf("week");
const datesOfWeek = Array.from({ length: 7 }, (_, i) =>
  startOfWeek.plus({ days: i })
);

interface TodoViewBaseProps {
  refetch: () => void;
  todos: Todo[];
  isLoading: boolean;
  search: string;
  isSharedTodosView: boolean;
  selectedCollaborator: string;
  onDragEnd: (result: DropResult) => void;
}

function onDragStart() {
  if (window.navigator.vibrate) {
    window.navigator.vibrate(400);
  }
}

const TodoViewBase: React.FC<TodoViewBaseProps> = ({
  todos,
  isLoading,
  refetch,
  search,
  isSharedTodosView: showSharedTodos,
  selectedCollaborator,
  onDragEnd,
}) => {
  return (
    <div
      className={classNames(
        "flex flex-row flex-wrap items-start justify-center gap-3",
        showSharedTodos && selectedCollaborator === "" ? "hidden" : ""
      )}
    >
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        {(Object.keys(Day) as Array<keyof typeof Day>).map((day, index) => (
          <DroppableDayArea
            date={datesOfWeek[index - 1] ?? DateTime.now()}
            refetch={refetch}
            searchValue={search}
            todos={todos.filter((todo) => todo.day === day)}
            key={day}
            day={day as Day}
            isLoading={isLoading}
          />
        ))}
      </DragDropContext>
    </div>
  );
};

export default TodoViewBase;
