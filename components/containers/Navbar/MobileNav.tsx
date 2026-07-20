"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {useCartCount, useFavoritesCount} from "@/hooks/useCounts";
import { PiHeartStraight } from "react-icons/pi";

import { SlHandbag } from "react-icons/sl";

import { NavLinks } from "./NavItems";
import {useRouter} from "next/navigation"
// import { icons } from "./DesktopNav";
import {
  Sheet,
  SheetContent,
  //   SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { IoMenu } from "react-icons/io5";
// import { IoClose } from "react-icons/io5";
// import { MdOutlineFavoriteBorder } from "react-icons/md";
// import { BsCart } from "react-icons/bs";
import { HiOutlineSearch } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";


export default function MobileNav() {
  const router = useRouter();
 

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = useCartCount();
  const favCount = useFavoritesCount();

   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(searchQuery.trim()){
      router.push(`/collections?search=${searchQuery}`)
    }
    
  };


  const icons = [
    { icon: <PiHeartStraight size={25} />, link: "/favorites", count: favCount },
    { icon: <SlHandbag size={25} />, link: "/cart", count: cartCount },
  ];


  return (
    <div className="">
      <div className="flex justify-between px-4 py-6 items-center ">
        {/* logo and menu */}
        <div className="flex gap-3">
          <Sheet>
            <SheetTrigger>
              <IoMenu size={30} />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  <div className="">
                    <form
                      onSubmit={handleSearch}

                      className="w-full  m-auto mt-8"
                    >
                      <div className=" flex items-center border pl-4 gap-2 border-gray h-[46px] rounded-full overflow-hidden bg-gray-200 ">
                        <HiOutlineSearch className="text-gray-600 text-2xl" />
                        <input
                          type="text"
                          placeholder="Search for products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value) }
                          className="  outline-none text-gray-700 bg-transparent placeholder-gray-600 text-md "
                        />
                      </div>
                    </form>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-4 px-4  ">
                {NavLinks.map((link, index) => (
                  <div key={index} className=" flex flex-col">
                    <div
                      className="flex items-center justify-between"
                      onClick={() =>
                        link.hasDropdown &&
                        setOpenDropdown(
                          openDropdown === link.name ? null : link.name,
                        )
                      }
                    >
                      <Link href={link.path} className="font-medium text-base">
                        {link.name}
                      </Link>
                      {link.hasDropdown && (
                        <RiArrowDropDownLine
                          className={`text-xl transition-transform ${openDropdown === link.name ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                    {link.hasDropdown && openDropdown === link.name && (
                      <div className="flex flex-col gap-3 mt-2 pl-4">
                        {link.dropdownItems.map((section, i) => (
                          <div key={i}>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">
                              {section.category}
                            </p>
                            {section.items.map((item, idx) => (
                              <Link
                                key={idx}
                                href={item.path}
                                className="text-sm text-gray-600 hover:text-[#EEB62A] transition-colors block"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Image
            src="/Image/new-black.png"
            alt="Wearvbo Logo"
            width={30}
            height={30}
            style={{width: "auto", height: "auto"}}
            priority
          />
        </div>

        {/* icons */}
        <div>
          <div className=" flex gap-2 ">
            <HiOutlineSearch size={25} className="" />
            {icons.map((item, index) => (
              <Link href={item.link} key={index} className="relative">
                {item.icon}
                {item.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
