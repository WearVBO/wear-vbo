import React from "react";
import Link from "next/link";
import { FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { SiVisa, SiMastercard, SiPaypal, SiApplepay, SiGooglepay } from "react-icons/si";

const Footer = () => {
  const socials = [
    { icon: <FaXTwitter />, href: "#" },
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaInstagram />, href: "#" },
  ];

  const links = {
    Company: ["About", "Features", "Careers"],
    Help: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
    FAQ: ["Account", "Orders", "Payments"],
  };
// px-8 py-14
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8  py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-center">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-black">WearVBO</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
              We have clothes that suits your style and which you&apos;re proud
              to wear. From women to men.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {socials.map(({ icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-black hover:text-black transition-colors text-gray-500"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-black">
                {heading}
              </h3>
              <ul className="flex flex-col gap-4 text-sm text-gray-500">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-black transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 px-4 md:px-6 lg:px-8 py-5 mx-auto max-w-screen-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">WearVBO {new Date().getFullYear()}. All Rights Reserved</p>

        <div className="flex items-center gap-3 text-gray-600">
          <SiVisa size={32} className="text-blue-700" />
          <SiMastercard size={28} className="text-red-500" />
          <SiPaypal size={24} className="text-blue-500" />
          <SiApplepay size={36} className="text-black" />
          <SiGooglepay size={36} className="text-gray-700" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;