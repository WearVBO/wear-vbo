"use client";
import Link from 'next/link'

import {usePathname} from 'next/navigation'
import { FaInstagram } from "react-icons/fa6";
import { RiFacebookFill, RiTwitterXFill } from "react-icons/ri";
import { FaTiktok } from "react-icons/fa";

const socialLinks = [
  {
    name: "Instagram",
    icon: <FaInstagram suppressHydrationWarning />,
    link: "https://www.instagram.com/wearvbo_?igsh=MTVvOGZucnFuYWtqYQ==",
    
  },
  {
    name: "FaceBook",
    icon: <RiFacebookFill suppressHydrationWarning />,
    
  },
  {
    name: "Twitter",
    icon: <RiTwitterXFill suppressHydrationWarning  />,
    
  },
  {
    name: "TikTok",
    icon: <FaTiktok  suppressHydrationWarning />,
    
  },
];

const SocialLinks = () => {
    const pathname = usePathname();
    const isHomePage = pathname === "/";
  return (
    <div>
      <div className={`flex justify-center items-center absolute ${isHomePage ? "max-xl:-bottom-20 md:bottom-10" : "mt-5"} left-1/2 transform -translate-x-1/2 space-x-5 `} >
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.link || "#"}
              target="_blank"
              className={` border md:p-2 p-1 rounded-full md:text-2xl text-xl  transition-colors ${isHomePage ? "text-white " : "text-black dark:text-white border-black dark:border-white"}`}
              suppressHydrationWarning
            >
              {link.icon}
            </Link>
          ))}
        </div>
    </div>
  )
}

export default SocialLinks
