import Head from "next/head";

type HeadComponentProps = {
  title: string;
};

function HeadComponent({ title }: HeadComponentProps) {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="T3Todo App" />
    </Head>
  );
}

export default HeadComponent;
