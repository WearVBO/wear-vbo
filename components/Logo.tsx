"use client";
import React from "react";
import Image from "next/image";
// import logoBlack from "@/public/logo-black.png";
// import logoWhite from "@/public/logo-white.png";
import { usePathname } from "next/navigation";

const Logo = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <div>
      {isHomePage ? (
        <>
          <Image
            src="/logo-white.png"
            alt="WearVbo Logo"
            width={150}
            height={80}
            className="block max-xl:hidden dark:block max-xl:dark:hidden w-[150px] cursor-pointer"
            suppressHydrationWarning
          />
          <Image
            src="/logo-black.png"
            alt="WearVbo Logo"
            width={150}
            height={80}
            className="block xl:hidden cursor-pointer w-[150px] dark:hidden max-xl:dark:block"
            suppressHydrationWarning
          />
        </>
      ) : (
        <>
          <Image
            src="/logo-black.png"
            alt="WearVbo Logo"
            width={150}
            height={80}
            className="cursor-pointer block w-[150px] dark:hidden max-xl:dark:block "
            suppressHydrationWarning
          />
          <Image
            src="/logo-white.png"
            alt="WearVbo Logo"
            width={150}
            height={80}
            className="hidden dark:block max-xl:dark:hidden w-[150px]  cursor-pointer"
            suppressHydrationWarning
          />
        </>
      )}
    </div>
  );
};

export default Logo;
