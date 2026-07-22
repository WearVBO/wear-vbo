"use client";
import React from "react";
import CustomerDetail from "@/components/admin/CustomerDetail";

export default function Page({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = React.use(params);
  return <CustomerDetail email={decodeURIComponent(email)} />;
}
