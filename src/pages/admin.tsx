import { type NextPage } from "next";
import CustomHead from "../components/shared/customHead";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import getServerSideProps from "../lib/serverProps";
import { buttonStyle } from "../styles/basicStyles";
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
      <CustomHead title="Admin" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex flex-wrap justify-evenly gap-2 px-5 pt-5">
            <button
              onClick={() => handleClickDeArchive()}
              className={buttonStyle}
            >
              Archivierte Todos wiederherstellen
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

export { getServerSideProps };
