import classNames from "classnames";
import { Poppins } from "next/font/google";

export const basicFontFamilyBold = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export const buttonStyle =
  "rounded-full bg-amber-400 hover:bg-amber-300 p-2 transform transition focus:outline-none font-medium backface-visibility-hidden text-md dark:text-gray-100 dark:bg-amber-700 dark:hover:bg-amber-800 text-slate-900";

export const disabledButtonStyle =
  "rounded-full bg-amber-400 p-2 focus:outline-none active:bg-opacity-60 font-medium backface-visibility-hidden text-md dark:text-gray-100 dark:bg-amber-600 bg-gray-300";

export const floatingButtonDivStyle = "fixed right-5 bottom-5 p-2 shadow-2xl";

export const basicIcon = "w-8 h-8";

export const inputStyle =
  "rounded-full border border-gray-300 bg-gray-50 p-4 text-md text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:hover:bg-gray-600 dark:focus:bg-gray-700";

export const gradientTextStyle = classNames(
  "bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent",
  basicFontFamilyBold.className,
);

export const comboboxOptionsStyle =
  "mt-1 flex  w-full flex-col rounded-lg bg-gray-100 py-3 shadow-md dark:bg-slate-700";

export const comboboxOptionBase =
  "relative w-full cursor-default select-none py-2 px-4 dark:text-white";

export const comboboxOptionActive =
  "bg-blue-100 text-blue-900 dark:bg-blue-500 dark:text-blue-100";
