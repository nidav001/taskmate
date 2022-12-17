import Head from "next/head";

type HeadComponentProps = {
  title: string;
};

function HeadComponent({ title }: HeadComponentProps) {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

export default HeadComponent;
