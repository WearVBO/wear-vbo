"use client";
import React from "react";
import useSWR from "swr";
import api from "@/lib/axios";
import Link from "next/link";
import ProductCard from "@/components/containers/Collections/ProductCard";
import { FavoritesSkeleton } from "@/components/containers/skeletons";

interface FavoriteItem {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    ratings: number;
    sizes: string[];
    tags: string[];
    availableColors: string[];
    productImages: { url: string; publicId: string; _id: string }[];
  };
  createdAt: string;
  updatedAt: string;
}

// Favorites is still account-scoped, so it keeps the user token.
const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const response = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const Favorites = () => {
  const { data, isLoading, error } = useSWR("/api/favorites", fetcher, {
    revalidateOnFocus: false,
  });
  const favorites = data?.data || [];

  if (isLoading) return <FavoritesSkeleton />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load favorites
      </div>
    );

  return (
    <section className="px-4 md:px-10 py-8 pb-10">
      <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
      <p className="text-gray-500 text-sm mb-8">{favorites.length} items</p>

      {favorites.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-lg">
            You have no favorite items yet.
          </p>
          <Link
            href="/collections"
            className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item: FavoriteItem) => (
            // <Link
              
            //   href={`/collections/product/${item.productId?._id}`}
            // >
              <ProductCard key={item._id}
                product={{
                  _id: item.productId?._id,
                  productName: item.productId?.productName,
                  productImages: item.productId?.productImages,
                  productPrice: item.productId?.productPrice,
                  isSoldOut: false,
                  ratings: item.productId?.ratings,
                  sizes: item.productId?.sizes,
                  availableColors: item.productId?.availableColors,
                  tags: item.productId?.tags,
                }}
              />
            // </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Favorites;
