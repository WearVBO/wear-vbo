import React from "react";

const Hero = () => {
  return (
    <section className='relative w-full  min-h-[600px] overflow-hidden bg-cover bg-center bg-[url("/Image/about.png")] md:bg-[url("/Image/desktop2.png")] '>
      <div className="absolute inset-0 bg-black/60"></div>
      {/* hero content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="max-w-4xl md:max-w-6xl pb-44 mx-auto text-center">
          <p className="text-white text-4xl font-bold ">About Us</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
