import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import classNames from "../../utils/classNames";

type TodoCardProps = {
  todoDone: boolean;
  setTodoDone?: (id: string, done: boolean) => void;
  todo: Todo;
  onBlurTextArea?: (newContent: string) => void;
  disclosureOpen?: boolean;
  isDragging?: boolean;
};

function TodoCard({
  todoDone,
  setTodoDone,
  todo,
  onBlurTextArea,
}: TodoCardProps) {
  const handleOnChange = () => {
    if (setTodoDone) {
      setTodoDone(todo.id, !todo.done);
    }
  };

  return (
    <div className="group flex transform flex-col rounded-xl bg-gray-300 py-1 px-4 text-black transition-opacity duration-300 ease-in-out hover:bg-gray-400 dark:bg-slate-500 dark:hover:bg-slate-600">
      <div className="group flex items-center justify-between gap-2">
        <input
          type="checkbox"
          readOnly={setTodoDone ? false : true}
          checked={todoDone}
          onChange={() => handleOnChange()}
          className="h-6 w-6 rounded-full"
        />
        <textarea
          disabled={setTodoDone ? false : true}
          onBlur={(e) => {
            if (onBlurTextArea) {
              onBlurTextArea(e.target.value);
            }
          }}
          defaultValue={todo.content}
          className={classNames(
            todoDone ? "line-through" : "",
            "resize-none border-0 bg-gray-300 text-base font-medium focus:ring-0 group-hover:bg-gray-400 dark:bg-slate-500 dark:group-hover:bg-slate-600"
          )}
        />
        <EllipsisVerticalIcon className="h-8 w-8" />
      </div>
    </div>
  );
}

export default TodoCard;
