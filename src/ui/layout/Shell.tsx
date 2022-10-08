import cx from "classnames";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../Button";

interface SideNavigationItem {
  name: string;
  to: string;
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

const navigation = [
  { name: "Dashboard", to: "/dashboard" },
  { name: "Settings", to: "/settings" },
].filter(Boolean) as SideNavigationItem[];

export const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="md:flex flex-col md:flex-row md:min-h-screen w-64">
      <div className="flex flex-col w-full md:w-64 text-gray-700 bg-white flex-shrink-0 border-r border-gray-200">
        <div className="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between">
          <Link href="/dashboard">
            <a className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg focus:outline-none focus:shadow-outline">
              SaaS name
            </a>
          </Link>
          <button className="rounded-lg md:hidden focus:outline-none focus:shadow-outline">
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <nav className="flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto">
          {navigation.map((item) => (
            <Link href={item.to}>
              <a
                className={cx(
                  "block px-4 py-2 mt-1 text-sm font-semibold text-gray-900 ",
                  router.pathname === item.to
                    ? "bg-gray-100"
                    : "hover:bg-gray-700 hover:text-white",
                )}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
        <Button
          variant="primary"
          className="border border-transparent"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
