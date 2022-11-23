import { Menu, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import classNames from "../utils/classNames";

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
      href: `${
        sessionData?.user?.id ? "/api/auth/signout" : "/api/auth/signin"
      }`,
    },
  ];

  return (
    <div className="min-w-screen flex h-20 items-center justify-end gap-2 bg-dark">
      <Menu as="div" className="pr-4">
        <div>
          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
    </div>
  );
};

export default TopNaviagtion;
