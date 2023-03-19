import classNames from "classnames";
import { DateTime } from "luxon";
import { type NextPage } from "next";
import { useState } from "react";
import DashboardCard from "../components/dashboard/dashboardCard";
import FloatingButton from "../components/dashboard/floatingButton";
import TodaysTodos from "../components/dashboard/todaysTodos";
import CustomHead from "../components/shared/customHead";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import getServerSideProps from "../lib/serverProps";
import { gradientTextStyle } from "../styles/basicStyles";
import { trpc } from "../utils/trpc";

const Dashboard: NextPage = () => {
  const [isLayoutSmall, setIsLayoutSmall] = useState<boolean>(false);
  const todosFromDb = trpc.todo.getOpenTodos.useQuery();
  const finalizedTodosFromDb = trpc.todo.getFinalizedTodos.useQuery();
  const user = trpc.user.getCurrentUser.useQuery();

  function getGreeting() {
    const { hour } = DateTime.local();

    let greeting;
    if (hour >= 5 && hour < 12) {
      greeting = "Guten Morgen";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Guten Tag";
    } else {
      greeting = "Guten Abend";
    }
    greeting += user.data?.name ? ` ${user.data?.name?.split(" ")[0]}` : "";

    return greeting;
  }

  return (
    <>
      <CustomHead title="Todo Dashboard" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex flex-col gap-10 pt-10">
            <div className="flex justify-center">
              <h1
                className={classNames(
                  gradientTextStyle,
                  "flex h-20 items-center text-4xl lg:text-6xl"
                )}
              >
                {getGreeting()}
              </h1>
            </div>
            <div className="flex flex-wrap justify-evenly gap-2 px-5">
              <DashboardCard
                content={todosFromDb.data?.length}
                title="Todos"
                href="/todos"
                isLoading={todosFromDb.isLoading}
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
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;

export { getServerSideProps };
