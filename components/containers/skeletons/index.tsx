import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Loading placeholders that mirror the real layouts one-for-one, so the page
 * doesn't reflow when data lands.
 */

/* -------------------------------- products -------------------------------- */

export const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="aspect-square w-full rounded-xl" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-20" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({
  count = 6,
  className = "grid grid-cols-2 md:grid-cols-3 gap-6",
}: {
  count?: number;
  className?: string;
}) => (
  <div className={className} aria-busy="true" aria-label="Loading products">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <section
    className="px-4 md:px-10 py-10 max-w-6xl mx-auto"
    aria-busy="true"
    aria-label="Loading product"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* gallery */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-16 md:h-20 md:w-20 rounded-md" />
          ))}
        </div>
        <Skeleton className="flex-1 aspect-square rounded-xl" />
      </div>

      {/* details */}
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-28" />

        <div className="flex flex-col gap-2 border-b pb-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* option picker */}
        <div>
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="flex gap-3 flex-wrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* quantity + add to cart */}
        <div className="flex items-center gap-4 mt-2">
          <Skeleton className="h-12 w-32 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
      </div>
    </div>

    {/* related */}
    <div className="mt-16">
      <Skeleton className="h-6 w-48 mb-6" />
      <ProductGridSkeleton
        count={4}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      />
    </div>
  </section>
);

/* ---------------------------------- cart ---------------------------------- */

export const CartLineSkeleton = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
    <div className="flex-1 flex flex-col gap-2">
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-20" />
    </div>
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-5 w-5 rounded" />
      <Skeleton className="h-9 w-28 rounded-full" />
    </div>
  </div>
);

export const CartSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <section
    className="px-4 md:px-10 pt-4 pb-10 md:pt-10"
    aria-busy="true"
    aria-label="Loading cart"
  >
    {/* breadcrumb */}
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-14" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-12" />
    </div>

    <div className="flex items-center justify-between mt-4 md:mt-2">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-20" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 flex flex-col border rounded-xl mt-4 divide-y">
        {Array.from({ length: lines }).map((_, i) => (
          <CartLineSkeleton key={i} />
        ))}
      </div>

      <div className="border rounded-xl p-6 h-fit flex flex-col gap-4">
        <Skeleton className="h-6 w-36" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-12 w-full rounded-full mt-2" />
      </div>
    </div>
  </section>
);

export const OrderSummarySkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div
    className="flex flex-col gap-4"
    aria-busy="true"
    aria-label="Loading order summary"
  >
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="flex justify-between">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-4 w-16" />
      </div>
    ))}
    <hr />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
    <div className="flex justify-between">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-20" />
    </div>
    <hr />
    <Skeleton className="h-3 w-3/4" />
  </div>
);

/* -------------------------------- favorites -------------------------------- */

export const FavoritesSkeleton = ({ count = 8 }: { count?: number }) => (
  <section
    className="px-4 md:px-10 py-8 pb-10"
    aria-busy="true"
    aria-label="Loading favorites"
  >
    <Skeleton className="h-9 w-56 mb-2" />
    <Skeleton className="h-4 w-24 mb-8" />
    <ProductGridSkeleton
      count={count}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    />
  </section>
);

/* ---------------------------------- admin ---------------------------------- */

export const TableRowsSkeleton = ({
  rows = 6,
  className,
}: {
  rows?: number;
  className?: string;
}) => (
  <div
    className={cn("divide-y divide-gray-100", className)}
    aria-busy="true"
    aria-label="Loading"
  >
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 md:px-6 py-4">
        <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-1/5" />
        </div>
        <Skeleton className="hidden md:block h-6 w-20 rounded-full" />
        <Skeleton className="hidden md:block h-4 w-16" />
      </div>
    ))}
  </div>
);

export const ProductEditorSkeleton = () => (
  <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading product">
    <Skeleton className="h-4 w-36" />
    <Skeleton className="h-9 w-64" />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-2xl border border-gray-200 p-5 md:p-6 flex flex-col gap-5">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-11 w-40 rounded-full" />
      </div>
      <div className="rounded-2xl border border-gray-200 p-5 md:p-6 h-fit">
        <Skeleton className="h-5 w-20 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
