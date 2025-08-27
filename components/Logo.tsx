"use client";
import React from "react";
import Image from "next/image";
import logoBlack from "@/public/logo-black.png";
import logoWhite from "@/public/logo-white.png";
import { usePathname } from "next/navigation";

const Logo = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <div>
      {isHomePage ? (
        <>
          <Image
            src={logoWhite}
            alt="WearVbo Logo"
            width={150}
            height={80}
            className="block max-xl:hidden  dark:hidden cursor-pointer"
          />
          <Image
            src={logoBlack}
            alt="WearVbo Logo"
            width={150}
            height={80}
            className="block xl:hidden cursor-pointer"
          />
        </>
      ) : (
        <Image
          src={logoBlack}
          alt="WearVbo Logo"
          width={150}
          height={80}
          className="cursor-pointer block dark:block "
        />
      )}
    </div>
  );
};

export default Logo;
