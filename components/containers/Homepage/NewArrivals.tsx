"use client";
import React from "react";
import useSWR from "swr";
import api from "@/lib/axios";
import Link from "next/link";
import ProductCard from "@/components/containers/Collections/ProductCard";
import { getGuestSession } from "@/lib/guestSession";

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  ratings: number;
  sizes: string[];
  tags: string[];
  availableColors: string[];
  productImages: { url: string; publicId: string; _id: string }[];
  isSoldOut: boolean;
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  let guestToken = localStorage.getItem("guestToken");

  if (!token) {
    guestToken = await getGuestSession();
  }

  const authToken = token || guestToken;

  const response = await api.get(url, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
  return response.data;
};

const NewArrivals = () => {
  const { data, isLoading, error } = useSWR(
    "/api/product/get-products?sort=newest&limit=4",
    fetcher,
    { revalidateOnFocus: false },
  );

  const products: Product[] = data?.data?.data || [];

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return null;

  return (
    <section className="px-4 md:px-8 py-10">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold">New Arrivals</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible">
        {products.map((product) => (
          <div key={product._id} className="min-w-[70%] sm:min-w-[45%] md:min-w-0">
            <ProductCard
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
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Link
          href="/collections"
          className="text-sm border border-gray-600 rounded-full px-8 py-3 hover:bg-black hover:text-white transition-colors"
        >
          View All
        </Link>
      </div>
    </section>
  );
};

export default NewArrivals;
