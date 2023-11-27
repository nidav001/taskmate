import {
  CheckCircleIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import classNames from "classnames";
import Link from "next/link";
import { basicIcon } from "../../../styles/basicStyles";
import DarkModeSwitch from "../../admin/darkModeSwitch";

export default function NavigationMenu() {
  const menuItemStyle =
    "rounded-full p-3 my-1 mx-1 hover:bg-sky-400 transform transition flex items-center active:scale-105 hover:bg-opacity-30 active:bg-opacity-40 bg-opacity-20 backface-visibility-hidden group";

  const iconStyle = `${basicIcon} text-sky-600`;

  const itemWrapperStyle = "flex items-center gap-2";

  function getMenuItem(href: string, icon: JSX.Element, title: string) {
    return (
      <Link href={href} className={menuItemStyle}>
        <div className={itemWrapperStyle}>
          <p>{icon}</p>
          <p
            className={classNames(
              "text-md font-medium text-gray-700 transition-colors duration-200 ease-in-out hover:text-gray-900 dark:text-white dark:group-hover:text-gray-300",
            )}
          >
            {title}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="sticky top-0 z-10">
      {getMenuItem("/", <HomeIcon className={iconStyle} />, "Dashboard")}
      {getMenuItem(
        "/todos",
        <CheckCircleIcon className={iconStyle} />,
        "Todos",
      )}
      {getMenuItem(
        "/addTodo",
        <PlusCircleIcon className={iconStyle} />,
        "Hinzufügen",
      )}
      <div className={menuItemStyle}>
        <DarkModeSwitch />
      </div>
    </div>
  );
}
