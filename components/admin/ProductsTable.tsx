"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { ArrowUpDown, Filter, Plus, Search } from "lucide-react";
import {
  AdminButton,
  AdminPagination,
  Card,
  EmptyState,
  ErrorState,
  LoadingRows,
  PageHeader,
  formatMoney,
} from "@/components/admin/ui/AdminUI";
import { buildProductUrl, getProducts } from "@/services/product.service";
import { getApiErrorMessage } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

const PAGE_SIZE = 6;

const ProductsTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showHidden, setShowHidden] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  const url = buildProductUrl({
    page,
    limit: PAGE_SIZE,
    sort,
    search: search.trim(),
  });
  const { data, isLoading, error, mutate } = useSWR(url, getProducts, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const allProducts: Product[] = data?.data?.data ?? [];
  const products = showHidden
    ? allProducts
    : allProducts.filter((product) => product.isActive);
  const totalPages = data?.data?.totalPages ?? 1;

  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const allSelected =
    products.length > 0 && products.every((p) => selected.includes(p._id));

  const toggleAll = () =>
    setSelected(allSelected ? [] : products.map((product) => product._id));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        subtitle="Manage your catalog, pricing and stock."
        action={
          <Link href="/admin/products/new">
            <AdminButton>
              <Plus size={17} /> Add Product
            </AdminButton>
          </Link>
        }
      />

      {/* toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full rounded-full border border-gray-200 py-3 pl-12 pr-4 text-sm outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowHidden((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm hover:border-black transition-colors"
          >
            <Filter size={16} />
            {showHidden ? "Show All Products" : "Published Only"}
          </button>
          <button
            onClick={() => {
              setSort((prev) => (prev === "price_asc" ? "price_desc" : "price_asc"));
              setPage(1);
            }}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm hover:border-black transition-colors"
          >
            <ArrowUpDown size={16} />
            {sort === "price_asc" ? "Price: Low to High" : "Price: High to Low"}
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* header row — desktop only */}
        <div className="hidden md:grid grid-cols-[40px_2fr_1fr_1fr_1.4fr_44px] items-center gap-4 border-b border-gray-100 bg-gray-50/60 px-6 py-4 text-sm font-medium">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            aria-label="Select all products"
            className="h-4 w-4 accent-black"
          />
          <span>Product</span>
          <span>Status</span>
          <span>Price</span>
          <span>Inventory</span>
          <span />
        </div>

        {isLoading && !data ? (
          <LoadingRows rows={PAGE_SIZE} />
        ) : error ? (
          <ErrorState
            message={getApiErrorMessage(error, "Could not load products.")}
            onRetry={() => mutate()}
          />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description={
              search
                ? `Nothing matched "${search}".`
                : "Add your first product to get started."
            }
            action={
              <Link href="/admin/products/new">
                <AdminButton>
                  <Plus size={17} /> Add Product
                </AdminButton>
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {products.map((product) => {
              return (
                <div
                  key={product._id}
                  className="grid grid-cols-[24px_1fr] md:grid-cols-[40px_2fr_1fr_1fr_1.4fr_44px] items-center gap-4 px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(product._id)}
                    onChange={() => toggleOne(product._id)}
                    aria-label={`Select ${product.productName}`}
                    className="h-4 w-4 accent-black"
                  />

                  {/* product cell */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {product.productImages?.[0]?.url && (
                        <Image
                          src={product.productImages[0].url}
                          alt={product.productName}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="block truncate font-medium hover:underline"
                      >
                        {product.productName}
                      </Link>
                      {/* stacked meta on mobile */}
                      <div className="mt-1 flex flex-wrap items-center gap-2 md:hidden">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-medium",
                            product.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500",
                          )}
                        >
                          {product.isActive ? "Published" : "Hidden"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatMoney(product.productPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* desktop columns */}
                  <span className="hidden md:block">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        product.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500",
                      )}
                    >
                      {product.isActive ? "Published" : "Hidden"}
                    </span>
                  </span>
                  <span className="hidden md:block font-medium">
                    {formatMoney(product.productPrice)}
                  </span>
                  <span className="hidden md:block text-sm text-gray-500">
                    {product.hasVariants
                      ? "Tracked per variant"
                      : "Single variant"}
                  </span>
                  <Link
                    href={`/admin/products/${product._id}`}
                    aria-label={`Edit ${product.productName}`}
                    className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-black hover:text-black transition-colors"
                  >
                    ⋯
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <AdminPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>

      {selected.length > 0 && (
        <p className="text-sm text-gray-500">
          {selected.length} product{selected.length > 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
};

export default ProductsTable;
