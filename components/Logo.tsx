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
            src="/new-white.png"
            alt="WearVbo Logo"
            width={80}
            height={50}
            className="block max-xl:hidden dark:block max-xl:dark:hidden w-[60px] mt-3 cursor-pointer"
            suppressHydrationWarning
          />
          <Image
            src="/new-black.png"
            alt="WearVbo Logo"
            width={80}
            height={50}
            className="block xl:hidden cursor-pointer w-[60px] dark:hidden mt-3 max-xl:dark:block"
            suppressHydrationWarning
          />
        </>
      ) : (
        <>
          <Image
            src="/new-black.png"
            alt="WearVbo Logo"
            width={80}
            height={50}
            className="cursor-pointer block w-[60px] mt-3 dark:hidden max-xl:dark:block "
            suppressHydrationWarning
          />
          <Image
            src="/new-white.png"
            alt="WearVbo Logo"
            width={80}
            height={50}
            className="hidden dark:block max-xl:dark:hidden w-[60px]  mt-3 cursor-pointer"
            suppressHydrationWarning
          />
        </>
      )}
    </div>
  );
};

export default Logo;
