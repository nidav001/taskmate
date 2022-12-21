import Head from "next/head";

type HeadComponentProps = {
  title: string;
};

function HeadComponent({ title }: HeadComponentProps) {
  // useEffect(() => {
  //   // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  //   if (
  //     localStorage.theme === "dark" ||
  //     (!("theme" in localStorage) &&
  //       window.matchMedia("(prefers-color-scheme: dark)").matches)
  //   ) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }

  //   // Whenever the user explicitly chooses light mode
  //   localStorage.theme = "light";

  //   // Whenever the user explicitly chooses dark mode
  //   localStorage.theme = "dark";

  //   // Whenever the user explicitly chooses to respect the OS preference
  //   localStorage.removeItem("theme");

  //   console.log(localStorage.theme);
  // }, []);

  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="T3Todo App" />
    </Head>
  );
}

export default HeadComponent;
