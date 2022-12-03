import { type NextPage } from "next";
import { useState } from "react";
import DashboardCard from "../components/dashboard/dashboardCard";
import FloatingButton from "../components/dashboard/floatingButton";
import Head from "../components/shared/head";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import TodoCard from "../components/shared/todoCard";
import getServerSideProps from "../lib/serverProps";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [smallWidth, setSmallWidth] = useState<boolean>(true);
  const todos = trpc.todo.getTodos.useQuery();
  const finalizedTodos = trpc.todo.getFinalizedTodos.useQuery();
  const archivedTodos = trpc.todo.getArchivedTodos.useQuery();
  const deletedTodos = trpc.todo.getDeletedTodos.useQuery();

  const todaysDate = new Date().toLocaleDateString();

  const todaysTodos = (
    <div className="flex w-full flex-col items-center px-5 pt-5">
      <h2 className="text-xl font-bold">Heutige Todos</h2>
      <div>{todaysDate}</div>
      <div className="flex flex-col gap-2 pt-2">
        {todos.data?.map((todo) => (
          <TodoCard todoDone={todo.done} key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
  return (
    <>
      <Head title="T3Todo" />
      <div className="flex h-full flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white">
          <TopNaviagtion />
          <div className="flex flex-wrap justify-evenly gap-2 px-5 pt-5">
            <DashboardCard
              content={todos.data?.length}
              title="Todos"
              href="/todos"
              isLoading={todos.isLoading}
              smallWidth={smallWidth}
            />
            <DashboardCard
              content={archivedTodos.data?.length}
              title="Archiviert"
              href="/todos/archived"
              isLoading={archivedTodos.isLoading}
              smallWidth={smallWidth}
            />
            <DashboardCard
              content={finalizedTodos.data?.length}
              title="Finalisiert"
              href="/todos/finalized"
              isLoading={finalizedTodos.isLoading}
              smallWidth={smallWidth}
            />
            <DashboardCard
              content={deletedTodos.data?.length}
              title="Gelöscht"
              href="/todos"
              isLoading={deletedTodos.isLoading}
              smallWidth={smallWidth}
            />
          </div>
          {todaysTodos}
          <FloatingButton
            smallWidth={smallWidth}
            setSmallWidth={setSmallWidth}
          />
        </main>
      </div>
    </>
  );
};

export default Home;

export { getServerSideProps };
