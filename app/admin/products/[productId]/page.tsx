"use client";
import React from "react";
import ProductEditor from "@/components/admin/ProductEditor";

export default function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = React.use(params);
  return <ProductEditor productId={productId} />;
}
