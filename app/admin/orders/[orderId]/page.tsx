"use client";
import React from "react";
import OrderDetail from "@/components/admin/OrderDetail";

export default function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = React.use(params);
  return <OrderDetail orderId={orderId} />;
}
