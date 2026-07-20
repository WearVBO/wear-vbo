import React from "react";
// import Image from "next/image";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden bg-cover bg-center bg-[url('/Image/mobile.png')] md:bg-[url('/Image/desktop.png')]">
      <div className="absolute inset-0 bg-black/40"></div>
      {/* hero content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="justify-end absolute top-6 right-0 flex flex-col">
          <p className="rounded-tl-lg bg-[#FFC633] px-3 py-1 font-bold text-md">
            NGN #
          </p>
          <p className="rounded-bl-lg bg-white px-3 py-1 font-bold text-md"> 
            USD $
          </p>
        </div>
        <div className="max-w-4xl md:max-w-6xl mx-auto text-white text-center flex flex-col items-center">
          <h1 className=" text-3xl md:text-6xl  font-bold">
            FIND ACTIVE WEARS THAT MATCHES YOUR STYLE
          </h1>
          <p className="md:text-lg w-full md:max-w-[450px] md:leading-8 md:tracking-wider   mt-4 ">
            Browse through our diverse range of active wears, designed to bring
            out your individuality and cater to your sense of style
          </p>
          <Button className="mt-6 bg-black w-full rounded-full max-w-[250px] md:max-w-[360px] h-full max-h-[50px] text-md cursor-pointer">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
