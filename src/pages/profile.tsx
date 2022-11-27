import { type NextPage } from "next";
import Head from "next/head";
import SideNavigation from "../components/sideNavigation";
import TopNaviagtion from "../components/topNavigation";

const Profile: NextPage = () => {
  return (
    <>
      <Head>
        <title>My Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white">
          <TopNaviagtion />
          <h1>Profile</h1>
        </main>
      </div>
    </>
  );
};

export default Profile;
