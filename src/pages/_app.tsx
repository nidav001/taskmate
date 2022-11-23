import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import { GetServerSideProps } from "next";
import { resetServerContext } from "react-beautiful-dnd";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  resetServerContext();
  return {
    props: { data: [] },
  };
};

export default trpc.withTRPC(MyApp);
