import { type NextPage } from "next";
import { type CtxOrReq } from "next-auth/client/_utils";
import { getCsrfToken, getProviders, signOut } from "next-auth/react";
import Head from "next/head";

const Signout: NextPage<> = () => {
  return (
    <>
      <Head>
        <title>T3Todo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen items-center justify-center bg-white">
        <button
          onClick={() =>
            signOut({
              callbackUrl: `${window.location.origin}/auth/signin`,
            })
          }
          className="rounded-xl border border-gray-300 p-4 hover:bg-gray-100"
        >
          <div className="flex items-center gap-2 text-xl">Sign out</div>
        </button>
      </main>
    </>
  );
};

export default Signout;

export async function getServerSideProps(context: CtxOrReq) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
    },
  };
}
