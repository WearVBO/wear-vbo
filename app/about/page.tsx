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
    <div className="min-h-screen bg-[url('/light.jpg')] dark:bg-[url('/dark.jpg')] md:bg-cover overflow-hidden ">
      <NavBar />
      <div
        className={` ${montserrat} flex flex-col justify-center items-center`}
      >
        <h1
          className={`${montserrat.className} text-4xl font-bold text-center max-xl:mt-8`}
        >
          ABOUT US
        </h1>
        <p
          className={`${montserrat.className} text-center w-full md:max-w-5xl max-w-3xl  md:text-lg text-sm md:p-0 p-3 mt-5 `}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, velit
          temporibus facere minima earum sapiente veniam quisquam voluptatem
          mollitia. Doloribus nesciunt assumenda, id excepturi est blanditiis
          quisquam magnam minima? Delectus laborum quam, deserunt ipsa vitae
          repellendus autem saepe enim labore iure ex voluptas est impedit modi
          inventore nostrum reprehenderit. Placeat praesentium voluptates eos
          officia. Culpa possimus officia, accusamus doloribus consectetur minus
          aperiam obcaecati adipisci ipsum earum distinctio beatae tenetur
          exercitationem?
        </p>
      </div>
      <div className="flex flex-col items-center justify-center text-center mt-12  ">
        <div className="grid md:grid-cols-2 gap-6">
          <Image
            src={active}
            alt="active"
            width={400}
            height={350}
            className="rounded-sm "
            suppressHydrationWarning
          />
          <div>
            <Image
              src={people}
              alt="people"
              width={400}
              height={400}
              className=" md:h-[230px]  h-[190px] w-full  rounded-sm"
              suppressHydrationWarning
            />
            <div className="flex space-x-4 mt-5">
              <Image
                src={lady}
                alt="lady"
                width={200}
                height={200}
                className="rounded-sm"
                suppressHydrationWarning
              />
              <Image
                src={ladies}
                alt="ladies"
                width={200}
                height={200}
                className="rounded-sm"
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
