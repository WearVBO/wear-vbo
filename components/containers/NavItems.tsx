"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

const NavLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About Us",
    path: "/about",
  },
];
const NavItems = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <div className="flex max-xl:flex-col space-x-4 max-xl:space-y-4 max-xl:items-start ">
      {NavLinks.map((link) => {
        const isActive: boolean = pathname === link.path;

        return (
          <Link
            key={link.name}
            href={link.path}
            className={`${
              isHomePage
                ? "text-white"
                : "text-black md:dark:text-white max-xl:text-black "
            }  max-xl:text-black text-lg  transition-colors ${
              poppins.className
            } ${
              isActive
                ? "underline underline-offset-10 decoration-[#EEB62A]"
                : ""
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
};

export default NavItems;
