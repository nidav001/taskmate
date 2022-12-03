import {
  CheckCircleIcon,
  Cog6ToothIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import Logo from "./logo";

const NavigationMenu: React.FC<{
  logoShown: string;
  closeMenu?: () => void;
}> = ({ logoShown, closeMenu }) => {
  const todoItemStyle =
    "rounded-3xl py-3 px-3 hover:bg-laccent hover:text-white flex items-center w-full";

  const iconStyle = "h-7 w-7 text-daccent";

  return (
    <div className="absolute sticky top-0 z-10 ">
      <Logo logoShown={logoShown} />
      <Link onClick={closeMenu} href="/" className={todoItemStyle}>
        <div className="flex gap-1">
          <HomeIcon className={iconStyle} />
          Dashboard
        </div>
      </Link>
      <Link onClick={closeMenu} href="/todos" className={todoItemStyle}>
        <div className="flex gap-1">
          <CheckCircleIcon className={iconStyle} />
          Todos
        </div>
      </Link>
      <Link onClick={closeMenu} href="/addTodo" className={todoItemStyle}>
        <div className="flex gap-1">
          <PlusCircleIcon className={iconStyle} />
          Add Todo
        </div>
      </Link>
      <Link onClick={closeMenu} href="/admin" className={todoItemStyle}>
        <div className="flex gap-1">
          <Cog6ToothIcon className={iconStyle} />
          Admin
        </div>
      </Link>
    </div>
  );
};

export default NavigationMenu;
