import { Poppins } from "@next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const poppins = Poppins({ weight: "400" });
const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <SessionProvider session={session}>
      <style jsx global>
        {`
          html {
            font-family: ${poppins.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
