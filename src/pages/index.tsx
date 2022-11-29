import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import getServerSideProps from "../lib/serverProps";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const todos = trpc.todo.getTodos.useQuery();
  const finalizedTodos = trpc.todo.getFinalizedTodos.useQuery();
  const archivedTodos = trpc.todo.getArchivedTodos.useQuery();
  const deletedTodos = trpc.todo.getDeletedTodos.useQuery();

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
            />
            <DashboardCard
              content={archivedTodos.data?.length}
              title="Archiviert"
              href="/todos/archived"
              isLoading={archivedTodos.isLoading}
            />
            <DashboardCard
              content={finalizedTodos.data?.length}
              title="Finalisiert"
              href="/todos/finalized"
              isLoading={finalizedTodos.isLoading}
            />
            <DashboardCard
              content={deletedTodos.data?.length}
              title="Gelöscht"
              href="/todos"
              isLoading={deletedTodos.isLoading}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

const DashboardCard: React.FC<{
  title: string;
  href: string;
  content: number | undefined;
  isLoading: boolean;
}> = ({ title, href, content, isLoading }) => {
  const loadingSkeleton = (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="mb-4 h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  return (
    <Link
      className="min-w-content flex max-w-sm flex-1 flex-col gap-3 rounded-xl bg-dark/10 p-4 text-black hover:bg-dark/20"
      href={href}
    >
      {isLoading ? (
        loadingSkeleton
      ) : (
        <>
          <h3 className="text-2xl font-bold">{title}</h3>
          <div className="w-40 text-lg">{content}</div>
        </>
      )}
    </Link>
  );
};

export { getServerSideProps };
