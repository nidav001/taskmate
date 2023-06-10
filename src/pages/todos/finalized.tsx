import classNames from "classnames";
import { type NextPage } from "next";
import { useEffect, useMemo } from "react";
import FinalizedToolbar from "../../components/finalizedTodos/finalizedToolbar";
import CustomHead from "../../components/shared/customHead";
import SideNavigation from "../../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../../components/shared/navigation/topNavigation";
import TodoCard from "../../components/shared/todoCard";
import useFinalizedTodoStore from "../../hooks/finalizedTodoStore";
import getServerSideProps from "../../lib/serverProps";
import { gradientTextStyle } from "../../styles/basicStyles";
import { trpc } from "../../utils/trpc";

const FinalizedTodos: NextPage = () => {
  const finalizedTodosQuery = trpc.todo.getFinalizedTodos.useQuery();
  const finalizedTodosFromDb = useMemo(
    () => finalizedTodosQuery?.data ?? [],
    [finalizedTodosQuery?.data]
  );

  const { finalizedTodos, setFinalizedTodos } = useFinalizedTodoStore();

  useEffect(() => {
    setFinalizedTodos(finalizedTodosFromDb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizedTodosFromDb]);

  const title = "Finalisierte Todos";

  return (
    <>
      <CustomHead title={title} />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex flex-col items-center gap-4 gap-10 pt-10">
            <h1
              className={classNames(
                gradientTextStyle,
                "flex h-20 items-center text-3xl lg:text-6xl"
              )}
            >
              {title}
            </h1>
            <div className="flex w-full flex-row justify-evenly">
              <FinalizedToolbar refetch={finalizedTodosQuery.refetch} />
            </div>

            <div className="flex flex-wrap justify-evenly px-5 pt-5">
              <div className="flex w-80 flex-col">
                {finalizedTodos
                  ? finalizedTodos?.map((todo) => (
                      <TodoCard
                        refetch={finalizedTodosQuery.refetch}
                        restore
                        isDragging={false}
                        key={todo.id}
                        todo={todo}
                      />
                    ))
                  : null}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default FinalizedTodos;

export { getServerSideProps };
