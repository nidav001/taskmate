import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import useDarkModeStore from "../../hooks/viewStore";

export default function DarkModeSwitch() {
  const { dark, setDark } = useDarkModeStore();
  return (
    <Switch
      id="theme-toggle"
      checked={dark}
      onChange={setDark}
      className={`${dark ? "bg-sky-600" : "bg-sky-300"}
  relative flex h-[40px] w-[80px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">Switch dark mode</span>
      <div
        aria-hidden="true"
        className={`${dark ? "translate-x-10" : "translate-x-0"}
    pointer-events-none flex h-[36px] w-[36px] transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      >
        {dark ? (
          <MoonIcon className="h-5 w-5 text-sky-600" />
        ) : (
          <SunIcon className="h-5 w-5 text-sky-400" />
        )}
      </div>
    </Switch>
  );
}
