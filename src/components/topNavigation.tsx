import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { LogoPosition } from "../types/enums";
import classNames from "../utils/classNames";
import Logo from "./logo";
import NavigationMenu from "./navigationMenu";

const TopNaviagtion: React.FC = () => {
  const sessionData = useSession().data;

  const menuItems = [
    { name: "Profil", href: `/profile` },
    {
      name: "Einstellungen",
      href: `/profile`,
    },
    {
      name: `${sessionData?.user?.id ? "Abmelden" : "Anmelden"}`,
      href: `${sessionData?.user?.id ? "/api/auth/signout" : "auth/signin"}`,
    },
  ];

  const ProfileMenuButton = (
    <Menu>
      <div>
        <Menu.Button className="outline-non flex rounded-full text-sm ring-2 ring-daccent/60 ring-offset-1  hover:ring-daccent">
          <Image
            width="40"
            height="40"
            className="h-8 w-8 rounded-full"
            src={sessionData?.user?.image ?? "/guestIcon.svg"}
            alt=""
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-3 top-14 right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {menuItems.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <Link
                  href={item.href}
                  legacyBehavior={false}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  {item.name}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );

  const MainMenuButton = (
    <Menu>
      {({ close }) => (
        <div className="md:hidden">
          <Menu.Button className="rounded-md p-1 ring-2 ring-daccent/60 hover:ring-daccent">
            <Bars3Icon className="h-6 w-6 text-daccent" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 top-20 z-10 h-screen w-full origin-top-right rounded-md bg-white py-1 pl-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <NavigationMenu closeMenu={close} logoShown={LogoPosition.Menu} />
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  );
  return (
    <div className="min-w-screen sticky top-0 z-50 flex h-20 items-center justify-between gap-2 border-b bg-newGray2 px-4 md:justify-end">
      {MainMenuButton}
      <Logo logoShown={LogoPosition.Top} />
      {ProfileMenuButton}
    </div>
  );
};

export default TopNaviagtion;
