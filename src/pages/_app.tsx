import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Poppins } from "next/font/google";
import { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";
import useThemeStore from "../hooks/themeStore";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });
const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    // Check the stored theme when the component mounts
    const storedTheme = window.localStorage.getItem("color-theme") as
      | "light"
      | "dark"
      | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme) {
      // If a theme is stored, apply it
      if (theme !== storedTheme) {
        toggleTheme();
      }
    } else if (systemPrefersDark) {
      // If no theme is stored, fall back to the system preference
      if (theme !== "dark") {
        toggleTheme();
      }
    }

    // Update the DOM class and the stored theme whenever the theme changes
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("color-theme", theme);
  }, []);

  useEffect(() => {
    // This useEffect will run when 'theme' changes, updating the DOM and localStorage accordingly
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("color-theme", theme);
  }, [theme]);

  return (
    <SessionProvider session={session}>
      <style jsx global>
        {`
          html {
            font-family: ${poppins.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
