import React from "react";
import Image from "next/image";

const Founders = () => {
  const founders = [
    { src: "/Image/venus.jpeg", name: "Venus" },
    { src: "/Image/bulus.jpeg", name: "Bulus" },
    { src: "/Image/oyin.jpeg", name: "Oyin" },
    { src: "/Image/onas.jpeg", name: "Onas" },
  ];
  return (
    <section className="py-12 px-4 md:py-20 md:px-8">
      <div className=" md:text-center mb-8 ">
        <p className="text-gray-800 font-bold tracking-widest uppercase">
          FASHION ICON
        </p>
        <h1 className="text-3xl font-bold">Meet the founders</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {founders.map((founder, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative w-full aspect-square">
              <Image
                src={founder.src}
                alt={founder.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="mt-2 font-medium">{founder.name}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <p className="text-center text-md max-w-2xl font-semibold leading-8  ">
          WearVBO was founded by four people inspired by fitness, fashion, and
          the confidence that comes from feeling good in what you wear. Seeing
          the need for activewear that balances performance and style, they set
          out to create pieces that move effortlessly with real life. Driven by
          purpose and passion, her vision is simple: to design activewear that
          empowers confidence, supports movement, and fits seamlessly into
          everyday routines.
        </p>
      </div>
    </section>
  );
};

export default Founders;
