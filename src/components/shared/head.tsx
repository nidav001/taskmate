import Head from "next/head";

type HeadProps = {
  title: string;
};

const asf: React.FC<HeadProps> = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default asf;
