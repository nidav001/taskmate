import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>T3Todo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-20 w-full bg-main"></div>
      <nav className="absolute flex h-full w-60 flex-col border bg-white bg-dark/10 px-5 shadow-md">
        <div className="py-3 pl-3 text-2xl font-bold tracking-tight text-dark">
          <span className="text-main">T3</span>Todo
        </div>
        <Link
          href="/"
          className="rounded-xl py-3 pl-3 hover:bg-laccent hover:text-white"
        >
          Dashboard
        </Link>
        <Link
          href="/todos"
          className="rounded-xl py-3 pl-3 hover:bg-laccent hover:text-white"
        >
          Todos
        </Link>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-center bg-light">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-dark sm:text-[5rem]">
            Create <span className="text-laccent">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
            <DashboardCard title="Todos" href="/" />
            <DashboardCard title="Done" href="/" />
            <DashboardCard title="Deleted" href="/" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-dark">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const DashboardCard: React.FC<{ title: string; href: string }> = ({
  title,
  href,
}) => {
  return (
    <Link
      className="flex max-w-xs flex-col gap-4 rounded-xl bg-dark/10 p-4 text-dark hover:bg-dark/20"
      href={href}
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="text-lg">
        Just the basics - Everything you need to know to set up your database
        and authentication.
      </div>
    </Link>
  );
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-dark/10 px-10 py-3 font-semibold text-dark no-underline transition hover:bg-dark/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
