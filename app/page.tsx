"use client";
import { useState } from "react";

import NavBar from "@/components/NavBar";
import SocialLinks from "@/components/SocialLinks";
import ModalPopup from "@/components/ModalPopup";
import { Montagu_Slab } from "next/font/google";
import { Montserrat } from "next/font/google";
import { Poppins } from "next/font/google";

import { Button } from "@/components/ui/button";

const montaguSlab = Montagu_Slab({
  subsets: ["latin"],
  weight: ["600"],
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
});

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="h-screen  md:bg-[url('/desktop.jpg')] bg-[url('/mobile.jpg')] bg-cover bg-center overflow-hidden ">
      <NavBar />
      <div className="flex  flex-col items-center justify-center text-center text-white md:mt-20 mt-30 ">
        <div
          className={`${montaguSlab.className} font-bold md:text-8xl text-6xl tracking-wider leading-snug text-center`}
        >
          <h1>WEARVBO</h1>
          <h1>COMING SOON</h1>
        </div>

        <p className={`${montserrat.className} `}>
          Your era of active wear is almost here
        </p>
        <Button
          onClick={openModal}
          className={`${poppins.className} bg-[#EEB62A] text-md w-[200px] ease-out mt-4 dark:text-white`}
        >
          Stay Updated
        </Button>
      </div>

      <div>
        <SocialLinks />
      </div>
      <ModalPopup
        isOpen={isModalOpen}
        onOpen={openModal}
        onClose={closeModal}
      />
    </div>
  );
};

export default Page;
