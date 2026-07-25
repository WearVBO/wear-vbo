"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export const NavLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Collections",
    path: "/collections",
    hasDropdown: true,
    dropdownItems: [
      {
        category: "Women",
        path: "/collections?category=female",
        items: [
          { label: "Tops", path: "/collections?category=female&subcategory=tops" },
          { label: "Bottoms", path: "/collections?category=female&subcategory=bottoms" },
          { label: "Sets", path: "/collections?category=female&subcategory=sets" },
          { label: "Dresses", path: "/collections?category=female&subcategory=dresses" },
        ],
      },
      {
        category: "Men",
        path: "/collections?category=male",

        items: [
          { label: "Shirts", path: "/collections?category=male&subcategory=shirts" },
          { label: "Shorts", path: "/collections?category=male&subcategory=shorts" },
        ],
      },
      {
        category: "Unisex",
        path: "/collections?category=unisex",
        items: [
          { label: "Hoodies", path: "/collections?category=unisex&subcategory=hoodies" }
        ],
      },
    ],
  },
  {
    name: "Contact",
    path: "/contact",
  },
  {
    name: "Track Order",
    path: "/track-order",
  },
  // {
  //   name: "Cart",
  //   path: "/cart",
  // }
];
const NavItems = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  return (
    <div className="flex flex-row space-x-4  ">
      {NavLinks.map((link) => {
        const isActive: boolean = pathname === link.path;

        return (
          <div
            onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.name)}
            onMouseLeave={() => link.hasDropdown && setOpenDropdown(null)}
            key={link.name}
            className="relative"
          >
            <Link
              key={link.name}
              href={link.path}
              className={`flex items-center gap-1  transition-colors ${poppins.className}${
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
              {link.hasDropdown && (
                <RiArrowDropDownLine
                  className={`text-lg transition-transform ${openDropdown === link.name ? "rotate-180" : ""}`}
                />
              )}
            </Link>

            {link.hasDropdown && openDropdown === link.name && (
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-xl p-4 z-50 flex gap-8 min-w-[300px]">
                {link.dropdownItems.map((section, i) => (
                  <div key={i}>
                    <Link href={section.path} className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      {section.category}
                    </Link>
                    <ul className="flex flex-col gap-2">

                    {section.items.map((item, idx) => (
                      <Link
                      key={idx}
                      href={item.path}
                      className="text-sm text-black hover:text-[#EEB62A] transition-colors block"
                      >
                        {item.label}
                      </Link>
                    ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NavItems;
