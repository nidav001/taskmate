import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type NextPage } from "next";
import { type CtxOrReq } from "next-auth/client/_utils";
import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
} from "next-auth/react";
import HeadComponent from "../../components/shared/head";

const Signin: NextPage<{
  csrfToken: string;
  providers: { name: string; id: string }[];
}> = ({ csrfToken, providers }) => {
  return (
    <>
      <HeadComponent title="Anmelden" />
      <main className="flex h-screen w-screen items-center justify-center bg-white dark:bg-slate-800">
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name} style={{ marginBottom: 0 }}>
              <button
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: `${window.location.origin}`,
                  })
                }
                className="rounded-xl border border-gray-300 p-4 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2 text-xl">
                  <FontAwesomeIcon icon={faGoogle} className="h-8 w-8" />
                  Sign in with {provider.name}
                </div>
              </button>
            </div>
          ))}
      </main>
    </>
  );
};

export default Signin;

export async function getServerSideProps(context: CtxOrReq) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
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
