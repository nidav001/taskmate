import Head from "next/head";
import { useEffect } from "react";

type HeadComponentProps = {
  title: string;
};

export default function CustomHead({ title }: HeadComponentProps) {
  useEffect(() => {
    const themeToggleDarkIcon = document.getElementById(
      "theme-toggle-dark-icon"
    );
    const themeToggleLightIcon = document.getElementById(
      "theme-toggle-light-icon"
    );

    localStorage.setItem("color-theme", "light");

    // Change the icons inside the button based on previous settings
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      themeToggleLightIcon?.classList.remove("hidden");
    } else {
      themeToggleDarkIcon?.classList.remove("hidden");
    }

    const themeToggleBtn = document.getElementById("theme-toggle");

    themeToggleBtn?.addEventListener("click", () => {
      // toggle icons inside button
      themeToggleDarkIcon?.classList.toggle("hidden");
      themeToggleLightIcon?.classList.toggle("hidden");

      // if set via local storage previously
      if (localStorage.getItem("color-theme")) {
        if (localStorage.getItem("color-theme") === "light") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        }
      }
    });
  }, []);

  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="T3Todo App" />
    </Head>
  );
}
