import { type Todo } from "@prisma/client";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import useMarkedTodoStore from "../../hooks/markedTodoStore";
import useTodoStore from "../../hooks/todoStore";
import { trpc } from "../../utils/trpc";
import TodoCard from "../shared/todoCard";

type DraggableTodoCardProps = {
  todo: Todo;
  index: number;
  refetch: () => void;
};

const DraggableTodoCard: React.FC<DraggableTodoCardProps> = ({
  todo,
  index,
  refetch,
}) => {
  const [todoDone, setTodoDoneState] = useState<boolean>(todo.done);

  const { markedTodos, addMarkedTodo } = useMarkedTodoStore();
  const { todos, setTodos } = useTodoStore();

  const setTodoDoneCallback = (id: string, done: boolean) => {
    setTodoDone.mutate({ id: id, done: done });
  };

  const updateTodoContent = trpc.todo.updateTodoContent.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const isMarked = markedTodos.includes(todo);

  const onLongPress = () => {
    console.log("longpress is triggered");
    if (!isMarked) {
      addMarkedTodo(todo);
    }
  };

  const onClick = () => {
    console.log("click is triggered");
  };

  function onBlurTextArea(newContent: string) {
    //Change local todos
    if (newContent !== todo.content) {
      if (newContent === "") {
        setTodos(todos?.filter((mappedTodo) => mappedTodo.id !== todo.id));
      }
      //Change database
      updateTodoContent.mutate({
        id: todo.id,
        content: newContent,
      });
    }
  }

  const setTodoDone = trpc.todo.setTodoDone.useMutation({
    onMutate: () => {
      setTodoDoneState(!todoDone);

      // Update local state
      const newTodos = todos?.map((mappedTodo) => {
        if (todo.id === mappedTodo.id) {
          return { ...mappedTodo, done: !mappedTodo.done };
        }
        return mappedTodo;
      });
      setTodos(newTodos);
    },
  });

  // const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          // {...longPressEvent}
          className="my-1 "
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <TodoCard
            todoDone={todoDone}
            setTodoDone={setTodoDoneCallback}
            todo={todo}
            onBlurTextArea={onBlurTextArea}
          />
        </div>
      )}
    </Draggable>
  );
};

export default DraggableTodoCard;
