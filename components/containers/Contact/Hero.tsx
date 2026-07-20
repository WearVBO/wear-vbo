import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full min-h-[600px] md:min-h-[700] overflow-hidden bg-[url('/Image/mobile-contact.png')] md:bg-[url('/Image/desktop-contact.png')] bg-cover bg-center">
      {/* <div className="absolute inset-0 bg-black/40"></div> */}
      {/* hero content */}
      <div className="absolute inset-0 flex flex-col items-center mt-5">
        <div className="max-w-4xl mx-auto py-20 px-4 md:px-8 text-center ">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Contact
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;
