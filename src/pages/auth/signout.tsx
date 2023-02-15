import { type NextPage } from "next";
import { type CtxOrReq } from "next-auth/client/_utils";
import {
  getCsrfToken,
  getProviders,
  getSession,
  signOut,
} from "next-auth/react";
import CustomHead from "../../components/shared/customHead";

const Signout: NextPage = () => {
  return (
    <>
      <CustomHead title="Abmelden" />
      <main className="flex h-screen w-screen items-center justify-center bg-white dark:bg-slate-800">
        <button
          type="button"
          onClick={() =>
            signOut({
              callbackUrl: `${window.location.origin}/auth/signin`,
            })
          }
          className="rounded-xl border border-gray-300 p-4 dark:bg-slate-600 dark:hover:bg-slate-700"
        >
          <div className="flex items-center gap-2 text-xl dark:text-white">
            Sign out
          </div>
        </button>
      </main>
    </>
  );
};

export default Signout;

export async function getServerSideProps(context: CtxOrReq) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
    },
  };
}
