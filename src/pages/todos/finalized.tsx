import { type NextPage } from "next";
import Head from "next/head";
import SideNavigation from "../../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../../components/shared/navigation/topNavigation";
import TodoCard from "../../components/shared/todoCard";
import getServerSideProps from "../../lib/serverProps";
import { trpc } from "../../utils/trpc";

const FinalizedTodos: NextPage = () => {
  const finalizedTodos = trpc.todo.getFinalizedTodos.useQuery().data;
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
            {finalizedTodos?.map((todo) => (
              <TodoCard
                todoDone={todo.done}
                key={todo.id}
                todo={todo}
                setTodoDone={() => {
                  console.log("FIX ME");
                }}
                onBlurTextArea={() => {
                  console.log("FIX ME");
                }}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default FinalizedTodos;

export { getServerSideProps };
