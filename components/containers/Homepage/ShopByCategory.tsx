"use client";
import React, { useState } from "react";
import useSWR from "swr";
import api from "@/lib/axios";
import Link from "next/link";
import ProductCard from "@/components/containers/Collections/ProductCard";
import { getGuestSession } from "@/lib/guestSession";
import type { Product } from "@/lib/types";

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  let guestToken = localStorage.getItem("guestToken");
  if (!token) guestToken = await getGuestSession();
  const authToken = token || guestToken;
  const response = await api.get(url, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
  return response.data;
};

const categories = [
  { label: "Women", tag: "female" },
  { label: "Men", tag: "male" },
  { label: "Unisex", tag: "unisex" },
];

const ShopByCategory = () => {
  const [activeCategory, setActiveCategory] = useState("female");

  const { data, isLoading } = useSWR(
    `/api/product/get-products?collections=${activeCategory}&limit=4`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const products: Product[] = data?.data?.data || [];

  return (
    <section className="px-4 md:px-10 py-10">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Shop By Category
      </h2>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.tag}
            onClick={() => setActiveCategory(cat.tag)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === cat.tag
                ? "bg-black text-white"
                : "border border-gray-300 text-gray-500 hover:border-black hover:text-black"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-xl" />
              <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded" />
              <div className="w-1/2 h-4 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                _id: product._id,
                productName: product.productName,
                productPrice: product.productPrice,
                productImages: product.productImages,
                isSoldOut: false,
                ratings: product.ratings,
                sizes: product.sizes,
                availableColors: product.availableColors,
                tags: product.tags,
              }}
            />
          ))}
        </div>
      )}

      {/* View All */}
      <div className="flex justify-center mt-8">
        <Link
          href={`/collections?category=${activeCategory}`}
          className="border border-black px-8 py-3 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition-colors"
        >
          View All
        </Link>
      </div>
    </section>
  );
};

export default ShopByCategory;