import { type Todo } from "@prisma/client";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import useTodoStore from "../../hooks/todoStore";
import { trpc } from "../../utils/trpc";
import TodoCard from "../shared/todoCard";

type DraggableTodoCardProps = {
  todo: Todo;
  index: number;
  refetch: () => void;
  disclosureOpen: boolean;
};

export default function DraggableTodoCard({
  todo,
  index,
  refetch,
  disclosureOpen,
}: DraggableTodoCardProps) {
  const [todoDone, setDoneState] = useState<boolean>(todo.checked);
  const { todos, setTodos } = useTodoStore();

  const setDoneCallback = (id: string, checked: boolean) => {
    setChecked.mutate({ id: id, checked: checked });
  };

  const updateTodoContent = trpc.todo.updateTodoContent.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  function onBlurTextArea(newContent: string) {
    //Change local todos
    if (newContent === todo.content) return;

    if (newContent === "") {
      setTodos(todos.filter((mappedTodo) => mappedTodo.id !== todo.id));
    }
    //Change database
    updateTodoContent.mutate({
      id: todo.id,
      content: newContent,
    });
  }

  const setChecked = trpc.todo.setChecked.useMutation({
    onMutate: () => {
      setDoneState(!todoDone);

      // Update local state
      const newTodos = todos.map((mappedTodo) => {
        if (todo.id === mappedTodo.id) {
          return { ...mappedTodo, checked: !mappedTodo.checked };
        }
        return mappedTodo;
      });
      setTodos(newTodos);
    },
  });

  return (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided, snapshot) => {
        return (
          <TodoCard
            provided={provided}
            isDragging={snapshot.isDragging}
            disclosureOpen={disclosureOpen}
            todoDone={todoDone}
            setChecked={setDoneCallback}
            todo={todo}
            onBlurTextArea={onBlurTextArea}
          />
        );
      }}
    </Draggable>
  );
}
