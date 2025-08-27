"use client";
import Link from 'next/link'

import {usePathname} from 'next/navigation'
import { FaInstagram } from "react-icons/fa6";
import { RiFacebookFill, RiTwitterXFill } from "react-icons/ri";
import { FaTiktok } from "react-icons/fa";

const socialLinks = [
  {
    name: "Instagram",
    icon: <FaInstagram />,
    link: "https://www.instagram.com/wearvbo_?igsh=MTVvOGZucnFuYWtqYQ==",
  },
  {
    name: "FaceBook",
    icon: <RiFacebookFill />,
  },
  {
    name: "Twitter",
    icon: <RiTwitterXFill />,
  },
  {
    name: "TikTok",
    icon: <FaTiktok />,
  },
];

const SocialLinks = () => {
    const pathname = usePathname();
    const isHomePage = pathname === "/";
  return (
    <div>
      <div className={`flex justify-center items-center absolute ${isHomePage ? "bottom-10 " : "bottom-3"} left-1/2 transform -translate-x-1/2 space-x-5`}>
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.link || "#"}
              target="_blank"
              className={` border p-2 rounded-full text-2xl  transition-colors ${isHomePage ? "text-white " : "text-black border-black"}`}
            >
              {link.icon}
            </Link>
          ))}
        </div>
    </div>
  )
}

export default SocialLinks
