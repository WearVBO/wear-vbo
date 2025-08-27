import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Montserrat } from "next/font/google";

import { IoMdClose } from "react-icons/io";
import image from "@/public/image 2.png";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "500"],
});

interface ModalPopupProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const ModalPopup: React.FC<ModalPopupProps> = ({ isOpen, onOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("form");

  useEffect(() => {
    const timer = setTimeout(() => {
      onOpen();
    }, 6000); // 6 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("thankYou");
  };
  const closeModal = () => {
    setStep("form");
    setEmail("");
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
      <div className="relative justify-center items-center backdrop-blur-5xl">
        <div className="relative bg-white p-4 rounded-lg shadow-lg  w-full md:max-w-[400px] max-xl:max-w-[300px] mx-auto mt-5 box-content ">
          {step === "form" ? (
            <div className="flex flex-col items-center justify-center mt-8 mb-3 ">
              <h2 className={`${montserrat.className} font-bold text-xl`}>
                We&#39;re launching soon!
              </h2>
              <p
                className={`${montserrat.className} w-full max-w-[250px] text-center text-md tracking-wide`}
              >
                Sign up to get exclusive updates & early access
              </p>
              <form onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-4 md:w-[350px] w-[250px] border-1 border-gray-400 px-4 py-5.5"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="w-full max-w-lg text-center flex flex-col items-center">
                  <Button className="bg-[#EEB62A] mt-4 w-full max-w-[200px] py-5 text-md">
                    {" "}
                    Submit{" "}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center p-7 pb-10">
              <div className="relative -mt-17 mb-4">
                <Image
                  src={image}
                  alt="success"
                  className="mx-auto w-18 h-18"
                />
              </div>
              <IoMdClose
                className="absolute top-2 right-2 cursor-pointer text-gray-500"
                size={24}
                onClick={closeModal}
              />
              <h1 className={`${montserrat.className} text-xl font-bold`}>
                Thanks for Joining!
              </h1>
              <p
                className={`${montserrat.className} font-light text-lg text-black/80`}
              >
                We&#39;ll keep you posted.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalPopup;
