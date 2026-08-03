"use client";
import React from "react";
// import Image from 'next/image'
import Hero from "@/components/containers/Homepage/Hero";
import NewArrivals from "@/components/containers/Homepage/NewArrivals"
import ShopByCategory from "@/components/containers/Homepage/ShopByCategory";

const homePage = () => {
  return (
    <div className="relative">
      <Hero />
      <NewArrivals />
      <ShopByCategory />
    </div>
  );
};

export default homePage;
