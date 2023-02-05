import { type NextPage } from "next";
import { useEffect, useState } from "react";
import DashboardCard from "../components/dashboard/dashboardCard";
import FloatingButton from "../components/dashboard/floatingButton";
import TodaysTodos from "../components/dashboard/todaysTodos";
import CustomHead from "../components/shared/customHead";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import getServerSideProps from "../lib/serverProps";
import { trpc } from "../utils/trpc";

const Dashboard: NextPage = () => {
  const [isLayoutSmall, setIsLayoutSmall] = useState<boolean>(false);
  const todosFromDb = trpc.todo.getOpenTodos.useQuery();
  const finalizedTodosFromDb = trpc.todo.getFinalizedTodos.useQuery();

  useEffect(() => {
    const handleResize = () => {
      setIsLayoutSmall(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <CustomHead title="T3Todo" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex flex-wrap justify-evenly gap-2 px-5 pt-5">
            <DashboardCard
              content={todosFromDb.data?.length}
              title="Todos"
              href="/todos"
              isLoading={todosFromDb.isLoading}
              smallWidth={isLayoutSmall}
            />
            <DashboardCard
              content={"Vielen Dank für Ihr Verständnis."}
              title="Umbau 🚧👷‍♂️"
              href="/todos/general"
              isLoading={false}
              smallWidth={isLayoutSmall}
            />
            <DashboardCard
              content={finalizedTodosFromDb.data?.length}
              title="Finalisiert"
              href="/todos/finalized"
              isLoading={finalizedTodosFromDb.isLoading}
              smallWidth={isLayoutSmall}
            />
          </div>
          <TodaysTodos todos={todosFromDb.data ?? []} />
          <FloatingButton
            isLayoutSmall={isLayoutSmall}
            setIsLayoutSmall={setIsLayoutSmall}
          />
        </main>
      </div>
    </>
  );
};

export default Dashboard;

export { getServerSideProps };
