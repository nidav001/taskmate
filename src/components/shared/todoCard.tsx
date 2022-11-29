import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import classNames from "../../utils/classNames";

const TodoCard: React.FC<{
  todoDone: boolean;
  setTodoDone: () => any;
  todo: Todo;
  onBlurTextArea: (newContent: string) => void;
}> = ({ todoDone, setTodoDone, todo, onBlurTextArea }) => {
  return (
    <div className="group flex flex-col rounded-xl bg-gray-300 py-1 px-4 text-black hover:bg-newGray">
      <div className="group flex items-center justify-between gap-2">
        <input
          type="checkbox"
          checked={todoDone}
          onChange={() => setTodoDone.mutate({ id: todo.id, done: !todo.done })}
          className="h-6 w-6 rounded-full"
        />
        <textarea
          onBlur={(e) => {
            onBlurTextArea(e.target.value);
          }}
          defaultValue={todo.content}
          className={classNames(
            todoDone ? "line-through" : "",
            "resize-none border-0 bg-gray-300 text-base focus:ring-0 group-hover:bg-newGray"
          )}
        />
        <EllipsisVerticalIcon className="h-8 w-8" />
      </div>
    </div>
  );
};

export default TodoCard;
