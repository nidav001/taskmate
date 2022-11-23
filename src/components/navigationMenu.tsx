import {
  CheckCircleIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import Logo from "./logo";

const NavigationMenu: React.FC<{ logoShown: string }> = ({ logoShown }) => {
  const todoItemStyle =
    "rounded-xl py-3 pl-1 hover:bg-laccent hover:text-white flex items-center w-2/4 md:w-full";

  const iconStyle = "h-7 w-7 text-daccent";

  return (
    <div className="px-2">
      <Logo logoShown={logoShown} />
      <Link href="/" className={todoItemStyle}>
        <div className="flex gap-1">
          <HomeIcon className={iconStyle} />
          Dashboard
        </div>
      </Link>
      <Link href="/todos" className={todoItemStyle}>
        <div className="flex gap-1">
          <CheckCircleIcon className={iconStyle} />
          Todos
        </div>
      </Link>
      <Link href="/addTodo" className={todoItemStyle}>
        <div className="flex gap-1">
          <PlusCircleIcon className={iconStyle} />
          Add Todo
        </div>
      </Link>
    </div>
  );
};

export default NavigationMenu;
