import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import useThemeStore from "../../hooks/themeStore";

export default function DarkModeSwitch() {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <Switch
      id="theme-toggle"
      checked={theme === "dark"}
      onChange={toggleTheme}
      className="relative flex h-[40px] w-[80px] shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-sky-300 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white  focus-visible:ring-opacity-75 dark:bg-sky-600"
    >
      <span className="sr-only">Switch dark mode</span>
      <div
        aria-hidden="true"
        className="pointer-events-none flex h-[36px] w-[36px] translate-x-0 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out dark:translate-x-10"
      >
        {theme === "dark" ? (
          <MoonIcon className="h-5 w-5 text-sky-600" />
        ) : (
          <SunIcon className="h-5 w-5 text-sky-400" />
        )}
      </div>
    </Switch>
  );
}
