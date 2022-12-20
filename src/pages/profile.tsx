import { type NextPage } from "next";
import HeadComponent from "../components/shared/head";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import getServerSideProps from "../lib/serverProps";

const Profile: NextPage = () => {
  return (
    <>
      <HeadComponent title="Profil" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <h1>Profile</h1>
        </main>
      </div>
    </>
  );
};

export default Profile;

export { getServerSideProps };
