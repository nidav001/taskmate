import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import SideNavigation from "../components/sideNavigation";
import TopNaviagtion from "../components/topNavigation";
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
        <main className="h-auto w-full bg-light">
          <TopNaviagtion />
          <div className="flex flex-wrap justify-evenly gap-2 px-5 pt-5">
            <DashboardCard
              content={todos.data?.length ?? 0}
              title="Todos"
              href="/todos"
            />
            <DashboardCard
              content={archivedTodos.data?.length ?? 0}
              title="Archiviert"
              href="/todos"
            />
            <DashboardCard
              content={finalizedTodos.data?.length ?? 0}
              title="Finalisiert"
              href="/todos"
            />
            <DashboardCard
              content={deletedTodos.data?.length ?? 0}
              title="Gelöscht"
              href="/todos"
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
  content: number;
}> = ({ title, href, content }) => {
  return (
    <Link
      className="min-w-content flex max-w-sm flex-1 flex-col gap-3 rounded-xl bg-dark/10 p-4 text-black hover:bg-dark/20"
      href={href}
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="w-40 text-lg">{content}</div>
    </Link>
  );
};
