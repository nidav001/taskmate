import { type NextPage } from "next";
import DarkModeSwitch from "../components/admin/darkModeSwitch";
import CustomHead from "../components/shared/customHead";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import getServerSideProps from "../lib/serverProps";

const Admin: NextPage = () => {
  return (
    <>
      <CustomHead title="Admin" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex flex-wrap justify-evenly gap-2 px-5 pt-5">
            <DarkModeSwitch />
          </div>
        </main>
      </div>
    </>
  );
};

export default Admin;

export { getServerSideProps };
