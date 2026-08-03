import React from "react";
// import { Button } from "./../../../components/ui/button";
import Link from "next/link";

const Image = () => {
  return (
    <section>
      {/* bg img */}
      {/* <div className="mx-auto"> */}
      <div className="relative w-full  text-white min-h-[400px] bg-[url('/Image/choose.png')] md:bg-[url('/Image/choose.png')] bg-cover bg-center overflow-hidden py-4">
        <div className="absolute inset-0" />
        <div className=" relative flex flex-col text-center items-center justify-center md:py-10 min-h-[400px]">
          <h1 className="font-bold text-3xl mb-4">Choosing Us</h1>
          <p className="italic font-semibold  tracking-widest leading-8 text-md max-w-lg mb-6">
            Choosing WearVBO means choosing quality, comfort, and confidence.
            Every piece is designed to move with you and support your lifestyle,
            wherever the day takes you.
          </p>
          <Link
            href="/collections"
            className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* </div> */}
    </section>
  );
};

export default Image;
