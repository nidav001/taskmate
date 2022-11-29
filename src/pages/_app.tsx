import { type Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import { type CtxOrReq } from "next-auth/client/_utils";
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

export async function getServerSideProps(context: CtxOrReq) {
  console.log("called getServerSideProps");
  resetServerContext();
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default trpc.withTRPC(MyApp);
