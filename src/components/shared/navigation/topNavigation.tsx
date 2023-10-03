import { Menu, Transition } from "@headlessui/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { profileMenu, sideMenu } from "../../../styles/transitionClasses";
import { LogoPosition } from "../../../types/enums";
import Logo from "./logo";
import NavigationMenu from "./navigationMenu";

export default function TopNaviagtion() {
  const sessionData = useSession().data;
  const genericHamburgerLine = `h-1 w-5 rounded-full transition bg-sky-600 ease transform duration-200`;

  // Sign in not used because user is redirected to /auth/signin
  const menuItems = [
    {
      name: `${sessionData?.user?.id ? "Abmelden" : "Anmelden"}`,
      href: `${sessionData?.user?.id ? "api/auth/signout" : "auth/signin"}`,
      icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />,
    },
  ];

  const ProfileMenuButton = (
    <Menu>
      <div>
        <Menu.Button
          className="text-md flex h-9 w-9 items-center justify-center rounded-full outline-none ring-1 ring-sky-600 ring-offset-1 ring-offset-transparent"
          aria-label="profile"
        >
          <Image
            width="50"
            height="50"
            className="h-8 w-8 rounded-full"
            src={sessionData?.user?.image ?? "/guestIcon.svg"}
            alt="Profile Image"
          />
        </Menu.Button>
      </div>
      <Transition as={Fragment} {...profileMenu}>
        <Menu.Items className="absolute right-3 top-14 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {menuItems.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <Link
                  href={item.href}
                  legacyBehavior={false}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "text-md block px-4 py-2 text-gray-700",
                  )}
                >
                  <span className="flex flex-row items-center gap-2">
                    {item.icon}
                    {item.name}
                  </span>
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );

  const MainMenuButton = (
    <Menu as="div" className="md:hidden">
      {({ open, close }) => (
        <>
          <Menu.Button
            as="button"
            aria-label="menu"
            className="group  flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full ring-1 ring-sky-600 ring-offset-1 ring-offset-transparent"
          >
            <div
              className={`${genericHamburgerLine} ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <div
              className={`${genericHamburgerLine} ${open ? "opacity-0" : ""}`}
            />
            <div
              className={`${genericHamburgerLine} ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </Menu.Button>
          <Transition as={Fragment} {...sideMenu}>
            <Menu.Items
              style={
                typeof window !== "undefined"
                  ? // eslint-disable-next-line no-restricted-globals
                    { height: screen.height - 80 }
                  : {}
              }
              className="absolute left-0 top-20 w-full bg-white py-1 pl-6 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-700"
            >
              <NavigationMenu closeMenu={close} logoStyle={LogoPosition.Menu} />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );

  return (
    <div className="min-w-screen sticky top-0 z-10 flex h-20 items-center justify-between gap-2 border-b bg-gray-100 px-4 dark:border-slate-900 dark:bg-slate-700 md:justify-end">
      {MainMenuButton}
      <Logo logoStyle={LogoPosition.Top} />
      {ProfileMenuButton}
    </div>
  );
}
