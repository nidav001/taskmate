import { Disclosure } from "@headlessui/react";
import {
  CheckCircleIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
const Navigation: React.FC = () => {
  const todoItemStyle =
    "rounded-xl py-3 pl-1 hover:bg-laccent hover:text-white flex items-center";
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <div className="flex h-full flex-col">
          <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2">
            <span className="sr-only">Open main menu</span>
            {open ? "ABC" : "Test"}
          </Disclosure.Button>
          <Disclosure.Panel className="flex h-full w-60 flex-col bg-dark/20 px-5">
            <div className="py-3 pl-1 text-2xl font-bold tracking-tight text-black">
              <span className="text-main">T3</span>Todo
            </div>
            <Link href="/" className={todoItemStyle}>
              <HomeIcon className="h-6 w-6 text-daccent" />
              Dashboard
            </Link>
            <Link href="/todos" className={todoItemStyle}>
              <CheckCircleIcon className="h-6 w-6 text-daccent" />
              Todos
            </Link>
            <Link href="/addTodo" className={todoItemStyle}>
              <PlusCircleIcon className="h-6 w-6 text-daccent" />
              Add Todo
            </Link>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};
export default Navigation;
