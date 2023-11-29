import Head from "next/head";

type HeadComponentProps = {
  title: string;
};

export default function CustomHead({ title }: HeadComponentProps) {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="TaskMate" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
