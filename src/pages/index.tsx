import { faBars, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import DashboardCard from "../components/dashboard/dashboardCard";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import getServerSideProps from "../lib/serverProps";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [smallWidth, setSmallWidth] = useState<boolean>(true);
  const todos = trpc.todo.getTodos.useQuery();
  const finalizedTodos = trpc.todo.getFinalizedTodos.useQuery();
  const archivedTodos = trpc.todo.getArchivedTodos.useQuery();
  const deletedTodos = trpc.todo.getDeletedTodos.useQuery();

  const toggleDashboardCardView = () => {
    setSmallWidth(!smallWidth);
  };

  const floatingButton = (
    <button className="h-10 w-10 p-2" onClick={() => toggleDashboardCardView()}>
      <FontAwesomeIcon
        icon={smallWidth ? faTableCellsLarge : faBars}
        size="lg"
      />
    </button>
  );

  return (
    <>
      <Head>
        <title>T3Todo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen flex-row">
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
          <div className="absolute right-5 bottom-5 rounded-full bg-daccent p-2 shadow-xl">
            {floatingButton}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

export { getServerSideProps };
