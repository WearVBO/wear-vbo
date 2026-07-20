"use client";
import React from "react";
// import Image from 'next/image'
import Hero from "@/components/containers/Homepage/Hero";
import NewArrivals from "@/components/containers/Homepage/NewArrivals"

const homePage = () => {
  return (
    <div className="relative">
      <Hero />
      <NewArrivals />
    </div>
  );
};

export default homePage;
