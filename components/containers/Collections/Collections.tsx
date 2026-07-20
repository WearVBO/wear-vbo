"use client";
import React, { useState } from "react";
import { getGuestSession } from "@/lib/guestSession";
import useSWR from "swr";
import api from "@/lib/axios";
// import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/containers/Collections/ProductCard";
import Sidebar from "@/components/containers/Collections/Sidebar";
import { CollectionsPagination } from "./Pagination";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

interface Product {
  _id: string;
  productName: string;
  productDescription: string;
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
  const authToken = token || guestToken;

  if (!guestToken && !token) {
    guestToken = await getGuestSession();
  }

  const response = await api.get(url, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
  return response.data;
};

const CollectionsPage = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") || "";
  const searchParam = searchParams?.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  // const buildUrl = () => {
  //   const params = new URLSearchParams();
  //   if (categoryParam) params.set("collections", categoryParam);
  //   if (searchParam) params.set("search", searchParam);
  //   params.set("page", page.toString());
  //   params.set("limit", "9");
  //   params.set("sort", sort);
  //   return `/api/product/get-products?${params.toString()}`;
  // };

 const url = `/api/product/get-products?page=${page}&limit=9&sort=${sort}${categoryParam ? `&collections=${categoryParam}` : ""}${searchParam ? `&search=${searchParam}` : ""}`;
const { data, isLoading, error } = useSWR(url, fetcher, {
  revalidateOnFocus: false,
});

console.log("current sort:", sort);

  // const { data, isLoading, error } = useSWR(
    // buildUrl(),
    // `/api/product/get-products?page=${page}&limit=9${categoryParam ? `?collections=${categoryParam}` : ""}`,
    // fetcher,
    // { revalidateOnFocus: false },
  // );

  const totalPages = data?.data?.totalPages || 1;
  const allProducts: Product[] = data?.data?.data || [];

  const filteredProducts = allProducts.filter((p: Product) => {
    const matchColor = selectedColors.length
      ? p.availableColors.some((c: string) => selectedColors.includes(c))
      : true;
    const matchSize = selectedSizes.length
      ? p.sizes.some((s: string) => selectedSizes.includes(s))
      : true;
    return matchColor && matchSize;
  });

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  console.log("selectedSizes:", selectedSizes);
console.log("filteredProducts:", filteredProducts.length);
console.log("allProducts:", allProducts.length);
console.log("url:", url);


  return (
    <section className="px-4 md:px-10 py-8">
      <div className="flex gap-8">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategory={selectedCategory}
          selectedColors={selectedColors}
          selectedSizes={selectedSizes}
          onCategoryChange={setSelectedCategory}
          onColorChange={handleColorChange}
          onSizeChange={handleSizeChange}
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} Products
            </p>

            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden border px-4 py-2 rounded-full text-sm"
            >
              Filters
            </button>
            <select
  value={sort}
  onChange={(e) => {
    console.log("sort changed to:", e.target.value);
    setSort(e.target.value);
    setPage(1);
  }}
  className="text-sm border border-gray-200 rounded-full px-4 py-2 outline-none cursor-pointer"
>
  <option value="newest">Newest</option>
  <option value="price_asc">Price: Low to High</option>
  <option value="price_desc">Price: High to Low</option>
</select>
          </div>

          {isLoading && <p className="text-center py-10">Loading...</p>}
          {error && (
            <p className="text-center py-10 text-red-500">
              Error loading products
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product: Product) => (
              // <Link key={product._id} href={`/collections/product/${product._id}`}>
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
              // </Link>
            ))}
          </div>
          <div className="mt-8">
            <CollectionsPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionsPage;
