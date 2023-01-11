import {
  CheckCircleIcon,
  Cog6ToothIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { basicIcon } from "../../../styles/basicStyles";
import Logo from "./logo";

type NavigationMenuProps = {
  logoShown: string;
  closeMenu?: () => void;
};

export default function NavigationMenu({
  logoShown,
  closeMenu,
}: NavigationMenuProps) {
  const menuItemStyle =
    "rounded-full p-3 my-1 mx-1 hover:bg-sky-400 transform transition flex items-center hover:scale-110 hover:bg-opacity-30 focus:outline-none active:bg-opacity-40 bg-opacity-20 font-medium backface-visibility-hidden text-sm dark:text-white";

  const iconStyle = `${basicIcon} text-sky-600`;

  const itemWrapperStyle = "flex items-center gap-1 ";

  function getMenuItem(href: string, icon: JSX.Element, title: string) {
    return (
      <Link onClick={closeMenu} href={href} className={menuItemStyle}>
        <div className={itemWrapperStyle}>
          {icon}
          {title}
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
      {getMenuItem("/admin", <Cog6ToothIcon className={iconStyle} />, "Admin")}
    </div>
  );
}
