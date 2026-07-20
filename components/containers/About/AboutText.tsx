import React from "react";
// import Image from

const AboutText = () => {
  const dynamic = [
    "Purposeful Design —  Performance-driven pieces made to move with you.",
    "Comfort & Style —  Breathable fabrics with flattering, modern fits,",
    "Quality Focused —  Durable materials made to last",
    " Confidence First — Designed to empower every body, every day",
  ];
  return (
    <section className="max-w-4xl md:max-w-5xl mx-auto md:text-center px-4 md:px-10 py-20 space-y-6">
      <div>
        <p className="text-md text-black/60 font-bold">OUR STORY</p>
        <h2 className="font-bold text-xl md:text-3xl">About WearVBO</h2>
      </div>
      <div className="text-md md:text-lg text-black/70 font-semibold leading-8">
        <p className="">
          At VBO, we believe in more than athleisure — we&apos;re creating a
          lifestyle where sport and timeless elegance intersect. Founded by four
          athletes who understand the grind, every collection reflects
          authenticity, performance, and refined design. From tennis matches to
          gym sessions, travels to everyday life, VBO is crafted for movers who
          demand versatility and style.{" "}
        </p>
        <br />

        <p className="">
          Our performance fabrics deliver comfort, durability, and
          sophistication, ensuring confidence on and off the court. What makes
          us distinct: athlete-driven origins, classic old-money influence,
          adaptable looks, and an empowering mission to build a community where
          movement, confidence, and style are always in motion.
        </p>
      </div>

      {/* dynamic quality */}
      <div className="py-4 md:py-8">
        <h2 className="font-bold text-lg md:text-xl">What Sets Us Apart</h2>
        <ul className="space-y-4 mt-4 md:text-center md:justify-center flex flex-col md:items-center">
          {dynamic.map((item, index) => (
            <li
              key={index}
              className="text-black/70 font-medium flex gap-2 text-md md:text-lg leading-6"
            >
              <p>✦</p>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </div>

     
    </section>
  );
};

export default AboutText;
