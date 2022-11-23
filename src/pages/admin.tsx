import { type NextPage } from "next";
import Head from "next/head";
import SideNavigation from "../components/sideNavigation";
import TopNaviagtion from "../components/topNavigation";
import { buttonStyle } from "../styles/buttonStyle";
import { trpc } from "../utils/trpc";

const Admin: NextPage = () => {
  const deArchiveTodos = trpc.admin.deArchiveTodos.useMutation();
  const restoreTodos = trpc.admin.restoreTodos.useMutation();

  const handleClickDeArchive = () => {
    deArchiveTodos.mutate();
  };

  const handleClickRestore = () => {
    restoreTodos.mutate();
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
              onClick={() => handleClickDeArchive()}
              className={buttonStyle}
            >
              Archivierte Todos ent-archivieren
            </button>
            <button
              onClick={() => handleClickRestore()}
              className={buttonStyle}
            >
              Gelöschte Todos wiederherstellen
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Admin;
