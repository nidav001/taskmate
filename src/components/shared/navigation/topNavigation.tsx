import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { profileMenu, sideMenu } from "../../../styles/transitionClasses";
import { LogoPosition } from "../../../types/enums";
import classNames from "../../../utils/classNames";
import Logo from "./logo";
import NavigationMenu from "./navigationMenu";

export default function TopNaviagtion() {
  const sessionData = useSession().data;
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    { name: "Profil", href: `/profile` },
    {
      name: "Einstellungen",
      href: `/profile`,
    },
    {
      name: `${sessionData?.user?.id ? "Abmelden" : "Anmelden"}`,
      href: `${sessionData?.user?.id ? "api/auth/signout" : "auth/signin"}`,
    },
  ];

  const ProfileMenuButton = (
    <Menu>
      <div>
        <Menu.Button
          className="outline-non ring-sky/60 flex rounded-full text-sm ring-2 ring-offset-1 hover:ring-sky-600"
          aria-label="profile"
        >
          <Image
            width="40"
            height="40"
            className="h-8 w-8 rounded-full"
            src={sessionData?.user?.image ?? "/guestIcon.svg"}
            alt="Profile Image"
          />
        </Menu.Button>
      </div>
      <Transition as={Fragment} {...profileMenu}>
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

  const getStyle = () => {
    if (typeof window !== "undefined") return { height: screen.height - 80 };
  };

  const MainMenuButton = (
    <Menu as={"div"} className="md:hidden">
      {({ close }) => (
        <>
          <Menu.Button
            aria-label="menu"
            className="ring-sky/60 rounded-md p-1 ring-2 hover:ring-sky-600"
          >
            <Bars3Icon className="h-6 w-6 text-sky-600" />
          </Menu.Button>
          <Transition as={Fragment} {...sideMenu}>
            <Menu.Items
              style={getStyle()}
              className={`absolute left-0 top-20 w-full bg-white py-1 pl-6 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-700`}
            >
              <NavigationMenu closeMenu={close} logoShown={LogoPosition.Menu} />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );

  return (
    <div className="min-w-screen sticky top-0 z-10 flex h-20 items-center justify-between gap-2 border-b bg-gray-100 px-4 dark:border-slate-900 dark:bg-slate-700 md:justify-end">
      {MainMenuButton}
      <Logo logoShown={LogoPosition.Top} />
      {ProfileMenuButton}
    </div>
  );
}
