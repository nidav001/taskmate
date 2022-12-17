import { type CtxOrReq } from "next-auth/client/_utils";
import { getSession } from "next-auth/react";

export default async function getServerSideProps(context: CtxOrReq) {
  console.log("called getServerSideProps");
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
