import { type NextPage } from "next";
import Head from "next/head";
import Navigation from "../../components/navigation";
import TopNaviagtion from "../../components/topNavigation";

const Todos: NextPage = () => {
  return (
    <>
      <Head>
        <title>My Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row">
        <Navigation />
        <main className="min-h-screen w-full bg-light lg:flex lg:flex-col">
          <TopNaviagtion />
          <h1>Todo</h1>
        </main>
      </div>
    </>
  );
};

export default Todos;
