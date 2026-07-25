"use client";
import React, {useState} from  "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import { Poppins } from "next/font/google";

// import { NavLinks } from "./NavItems";
import NavItems from "./NavItems";

import { HiOutlineSearch } from "react-icons/hi";

import { PiHeartStraight } from "react-icons/pi";

import { SlHandbag } from "react-icons/sl";
import {useCartCount, useFavoritesCount} from "@/hooks/useCounts";






export default function DesktopNav() {
  const cartCount = useCartCount();
const favCount = useFavoritesCount();

const router = useRouter();
const [searchQuery, setSearchQuery] = useState("")

 const icons = [
  { icon: <PiHeartStraight size={25} />, link: "/favorites" , count: favCount},
  { icon: <SlHandbag size={25} />, link: "/cart" , count: cartCount},
];
  // const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  // const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(searchQuery.trim()){
      router.push(`/collections?search=${searchQuery}`)
    }
  };
  const pathname = usePathname();

  return (
    <nav className=" w-full border-b">
      <div className="w-full">
        <div className="flex justify-between items-center  px-4 md:px-8 lg:px-10 py-4 md:py-5 ">
          {/* logo for desktop */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/Image/new-vbo.png"
                alt="WearVbo Logo"
                width={80}
                height={50}
                className="cursor-pointer w-[60px] "
                loading="eager"
                priority
                suppressHydrationWarning
              />
            </Link>
          </div>

          {/* links & search bar */}

          <div className="flex gap-8 items-center justify-center">
            {/* nav links for desktop */}
            <div>
              <NavItems />
            </div>

            {/* search bar */}
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="w-full  m-auto">
                <div className="w-[200px] md:w-[250px] lg:w-[300px] flex items-center border pl-4 gap-2 border-gray h-[42px] md:[46px] rounded-full overflow-hidden bg-gray-100 ">
                  <HiOutlineSearch className="text-gray-500 text-xl md:text-2xl flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="  outline-none text-gray-700 bg-transparent placeholder-gray-600 text-md "
                  />
                </div>
              </form>
            </div>
          </div>

          {/* icons */}
          <div className="flex gap-3">
            {icons.map((item, idx) => {
              const isActive: boolean = pathname === item.link;
              return (
                <Link key={idx} href={item.link} className={`relative ${isActive ? "text-[#EEB62A]" : "text-black"}`}>
                  {item.icon}
                  {item.count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                  {/* <Link
                    href={item.link}
                    className={`${isActive ? "text-[#EEB62A]" : "text-black"}`}
                  >
                    {item.icon}
                  </Link> */}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

// export default DesktopNav;

// mx-auto px-4 md:px-8 lg:px-10 py-3 lg:py-4
