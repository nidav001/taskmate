import {
  CheckCircleIcon,
  Cog6ToothIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import Logo from "./logo";

type NavigationMenuProps = {
  logoShown: string;
  closeMenu?: () => void;
};

function NavigationMenu({ logoShown, closeMenu }: NavigationMenuProps) {
  const menuItemStyle =
    "rounded-full p-3 my-1 mx-1 hover:bg-sky-400 transform transition flex items-center hover:scale-110 hover:bg-opacity-30 focus:outline-none active:bg-opacity-40 bg-opacity-20 font-medium backface-visibility-hidden text-sm dark:text-white";

  const iconStyle = "h-7 w-7 text-sky-600";

  const itemWrapperStyle = "flex items-center gap-1 ";

  return (
    <div className="absolute sticky top-0 z-10 ">
      <Logo logoShown={logoShown} />
      <Link onClick={closeMenu} href="/" className={menuItemStyle}>
        <div className={itemWrapperStyle}>
          <HomeIcon className={iconStyle} />
          Dashboard
        </div>
      </Link>
      <Link onClick={closeMenu} href="/todos" className={menuItemStyle}>
        <div className={itemWrapperStyle}>
          <CheckCircleIcon className={iconStyle} />
          Todos
        </div>
      </Link>
      <Link onClick={closeMenu} href="/addTodo" className={menuItemStyle}>
        <div className={itemWrapperStyle}>
          <PlusCircleIcon className={iconStyle} />
          Add Todo
        </div>
      </Link>
      <Link onClick={closeMenu} href="/admin" className={menuItemStyle}>
        <div className={itemWrapperStyle}>
          <Cog6ToothIcon className={iconStyle} />
          Admin
        </div>
      </Link>
    </div>
  );
}

export default NavigationMenu;
