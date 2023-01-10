import { type Todo } from "@prisma/client";
import CustomHead from "../shared/customHead";
import SideNavigation from "../shared/navigation/sideNavigation";
import TopNaviagtion from "../shared/navigation/topNavigation";
import TodoCard from "../shared/todoCard";
import GeneralAndFinalizedToolbar from "./generalAndFinalizedToolbar";

type GeneralAndFinalizedTodosProps = {
  todos: Todo[];
  title: string;
  refetch: () => void;
};

export default function GeneralAndFinalizedTodos({
  todos,
  title,
  refetch,
}: GeneralAndFinalizedTodosProps) {
  return (
    <>
      <CustomHead title={title} />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />

          <h1 className="mt-5 text-center text-2xl font-bold dark:text-white">
            {title}
          </h1>
          <div className="flex flex-row justify-center">
            <GeneralAndFinalizedToolbar todos={todos} refetch={refetch} />
          </div>
          <div className="flex flex-wrap justify-evenly px-5 pt-5">
            {todos?.map((todo) => (
              <TodoCard
                refetch={refetch}
                restore={true}
                isDragging={false}
                key={todo.id}
                todo={todo}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
