import { type NextPage } from "next";
import Head from "next/head";
import SideNavigation from "../components/sideNavigation";
import TopNaviagtion from "../components/topNavigation";
import { buttonStyle } from "../styles/buttonStyle";
import { trpc } from "../utils/trpc";

const Admin: NextPage = () => {
  const dearchiveTodos = trpc.admin.dearchiveTodos.useMutation();

  const handleClickArchive = () => {
    dearchiveTodos.mutate();
  };

  return (
    <>
      <Head>
        <title>T3Todo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row">
        <SideNavigation />
        <main className="min-h-screen w-full bg-light">
          <TopNaviagtion />
          <div className="flex flex-wrap justify-evenly gap-2 px-5 pt-5">
            <button
              onClick={() => handleClickArchive()}
              className={buttonStyle}
            >
              Archivierte Todos ent-archivieren
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Admin;
