"use client";
import React from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import SocialLinks from "@/components/SocialLinks";

import active from "@/public/active.jpg";
import people from "@/public/people.jpg";
import lady from "@/public/lady.jpg";
import ladies from "@/public/ladies.jpg";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "400"],
});

const page = () => {
  return (
    <div className="min-h-screen bg-[url('/light.jpg')] dark:bg-[url('/dark.jpg')] md:bg-cover overflow-hidden " >
      <NavBar />
      <div
        className={` ${montserrat} flex flex-col justify-center items-center`} data-aos="fade-up" 
      >
        <h1
          className={`${montserrat.className} text-4xl font-bold text-center max-xl:mt-8`}
        >
          ABOUT US
        </h1>
        <p
          className={`${montserrat.className} text-center w-full md:max-w-5xl max-w-3xl  md:text-lg text-sm md:p-0 p-3 mt-5 `}
        >
          At VBO, we believe in more than athleisure — we’re creating a
          lifestyle where sport and timeless elegance intersect. Founded by four
          athletes who understand the grind, every collection reflects
          authenticity, performance, and refined design. From tennis matches to
          gym sessions, travels to everyday life, VBO is crafted for movers who
          demand versatility and style. Our performance fabrics deliver comfort,
          durability, and sophistication, ensuring confidence on and off the
          court. What makes us distinct: athlete-driven origins, classic
          old-money influence, adaptable looks, and an empowering mission to
          build a community where movement, confidence, and style are always in
          motion.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center text-center mt-10  ">
        <div className="grid md:grid-cols-2 gap-6 md:p-0 p-3">
          <Image
            src={active}
            alt="active"
            width={400}
            height={350}
            className="rounded-sm w-full max-w-[400px] h-full max-h-[500px]"
            suppressHydrationWarning
             data-aos="zoom-in-right"
          />
          <div data-aos="zoom-out">
            <Image
              src={people}
              alt="people"
              width={400}
              height={400}
              className=" lg:h-[215px]  h-[180px] w-full  rounded-sm"
              suppressHydrationWarning
             
            />
            <div className="flex space-x-3 mt-5">
              <Image
                src={lady}
                alt="lady"
                width={200}
                height={200}
                className="rounded-sm max-xl:h-[250px] max-xl:w-[250px]"
                suppressHydrationWarning
              />
              <Image
                src={ladies}
                alt="ladies"
                width={200}
                height={200}
                className="rounded-sm max-xl:h-[250px] max-xl:w-[250px]"
                suppressHydrationWarning
              />
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <SocialLinks />
      </div>
    </div>
  );
};

export default page;
