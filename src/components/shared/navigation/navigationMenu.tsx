import {
  CheckCircleIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import classNames from "classnames";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { basicIcon } from "../../../styles/basicStyles";
import DarkModeSwitch from "../../admin/darkModeSwitch";
import Logo from "./logo";

type NavigationMenuProps = {
  logoShown: string;
  closeMenu?: () => void;
};

const poppins = Poppins({ weight: "400", subsets: ["latin"] });

export default function NavigationMenu({
  logoShown,
  closeMenu,
}: NavigationMenuProps) {
  const menuItemStyle =
    "rounded-full p-3 my-1 mx-1 hover:bg-sky-400 transform transition flex items-center active:scale-110 hover:bg-opacity-30 active:bg-opacity-40 bg-opacity-20 backface-visibility-hidden group";

  const iconStyle = `${basicIcon} text-sky-600`;

  const itemWrapperStyle = "flex items-center gap-1";

  function getMenuItem(href: string, icon: JSX.Element, title: string) {
    return (
      <Link onClick={closeMenu} href={href} className={menuItemStyle}>
        <div className={itemWrapperStyle}>
          <p>{icon}</p>
          <p
            className={classNames(
              "text-md font-medium text-gray-700 transition-colors duration-200 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
              poppins.className
            )}
          >
            {title}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="absolute sticky top-0 z-10 w-2/3 sm:w-full">
      <Logo logoShown={logoShown} />
      {getMenuItem("/", <HomeIcon className={iconStyle} />, "Dashboard")}
      {getMenuItem(
        "/todos",
        <CheckCircleIcon className={iconStyle} />,
        "Todos"
      )}
      {getMenuItem(
        "/addTodo",
        <PlusCircleIcon className={iconStyle} />,
        "Hinzufügen"
      )}
      <div className={menuItemStyle}>
        <DarkModeSwitch />
      </div>
    </div>
  );
}
