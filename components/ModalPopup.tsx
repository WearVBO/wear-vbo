"use client"
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

import axios from "axios";
import { baseURL } from "@/config";

import image from "@/public/image 2.png";

import Image from "next/image";
import { Montserrat } from "next/font/google";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { emailSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "500"],
});

interface ModalPopupProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface FormData {
  email: string;

}

const ModalPopup: React.FC<ModalPopupProps> = ({ isOpen, onOpen, onClose }) => {
  
  const [step, setStep] = useState<string>("form");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    
    },
  });

  async function onSubmit(values: z.infer<typeof emailSchema>) {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        subscribed: true,
      };
      const response = await axios.post(
        `${baseURL}/api/auth/newsletter`,
        payload
      );
      console.log("Success:", response.data);
      setStep("thank You");
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response:", error.response?.data);
        console.error("Status:", error.response?.status);
      }
    } finally {
      setLoading(false);
    }
  }


  const hasRun = useRef(false);

  if (!hasRun.current) {
    hasRun.current = true;
    setTimeout(() => {
      onOpen();
    }, 6000);
  }
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onOpen();
  //   }, 6000); // 6 seconds
  //   return () => clearTimeout(timer);
  // }, [onOpen]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setStep("thankYou");
  // };
  const closeModal = () => {
    setStep("form");
    // setEmail("");
    reset()
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
      <div className="relative justify-center items-center backdrop-blur-5xl">
        <div className="relative bg-white p-4 rounded-lg shadow-lg  w-full md:max-w-[400px] max-xl:max-w-[300px] mx-auto mt-5 box-content ">
          {step === "form" ? (
            <div className="flex flex-col items-center justify-center mt-8 mb-3 ">
              <h2
                className={`${montserrat.className} font-bold text-xl dark:text-black `}
              >
                We&#39;re launching soon!
              </h2>
              <p
                className={`${montserrat.className} w-full max-w-[250px] text-center text-md tracking-wide dark:text-black`}
              >
                Sign up to get exclusive updates & early access
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-4 md:w-[350px] w-[250px] border-1 border-gray-400 px-4 py-5.5 text-black"
                  {...register("email", { required: "This is required." })}
                  // onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-black">
                  {typeof errors.email?.message === "string"
                    ? errors.email.message
                    : ""}
                </p>
                <div className="w-full max-w-lg text-center flex flex-col items-center">
                  <Button
                    type="submit"
                    // disabled={!email.trim() || loading}
                    className={`bg-[#EEB62A] mt-4 
                    }  w-full max-w-[200px] py-5 text-md`}
                  >
                    {" "}
                     {loading ? "Submitting..." : "Submit"}
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
              <h1
                className={`${montserrat.className} text-xl font-bold dark:text-black`}
              >
                Thanks for Joining!
              </h1>
              <p
                className={`${montserrat.className} font-light text-lg text-black/80 dark:text-black`}
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
