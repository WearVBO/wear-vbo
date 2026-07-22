"use client";
import React from "react";
import useSWR from "swr";
import Link from "next/link";
import ProductCard from "@/components/containers/Collections/ProductCard";
import { buildProductUrl, getProducts } from "@/services/product.service";
import { ProductGridSkeleton } from "@/components/containers/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/types";

const NewArrivals = () => {
  const { data, isLoading, error } = useSWR(
    buildProductUrl({ sort: "newest", limit: 4 }),
    getProducts,
    { revalidateOnFocus: false },
  );

  const products: Product[] = data?.data?.data || [];

  if (error) return null;

  if (isLoading)
    return (
      <section className="px-4 md:px-8 py-10">
        <div className="flex justify-center mb-6">
          <Skeleton className="h-10 w-56" />
        </div>
        <ProductGridSkeleton
          count={4}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        />
      </section>
    );

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
