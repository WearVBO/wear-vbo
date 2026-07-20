import React from "react";
import Hero from "@/components/containers/About/Hero";
import AboutText from "@/components/containers/About/AboutText";
import AboutImg from "@/components/containers/About/AboutImg";
import Founders from "@/components/containers/About/Founders"

const aboutUs = () => {
  return (
    <div>
      <Hero />
      <AboutText />
      <AboutImg />
      <Founders />
    </div>
  );
};

export default aboutUs;
