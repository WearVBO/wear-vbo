"use client";
import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { ArrowUpRight, Package, Receipt, Users, Wallet } from "lucide-react";
import {
  Card,
  EmptyState,
  LoadingRows,
  PageHeader,
  StatusBadge,
  formatDate,
  formatMoney,
} from "@/components/admin/ui/AdminUI";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import { buildProductUrl, getProducts } from "@/services/product.service";

const StatCard = ({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  hint?: string;
}) => (
  <Card className="p-5">
    <div className="flex items-start justify-between">
      <p className="text-sm text-gray-500">{label}</p>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
        <Icon size={17} />
      </span>
    </div>
    <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
    {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </Card>
);

const Overview = () => {
  const { customers, orders, isLoading } = useAdminCustomers();
  const { data: productData } = useSWR(
    buildProductUrl({ page: 1, limit: 1 }),
    getProducts,
    { revalidateOnFocus: false },
  );

  const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
  const revenue = paidOrders.reduce((sum, order) => sum + order.grandTotal, 0);
  const pending = orders.filter(
    (order) => order.orderStatus === "pending",
  ).length;
  const recent = orders.slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        subtitle="An overview of your store's activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatMoney(revenue)}
          icon={Wallet}
          hint={`${paidOrders.length} paid orders`}
        />
        <StatCard
          label="Orders"
          value={String(orders.length)}
          icon={Receipt}
          hint={`${pending} awaiting confirmation`}
        />
        <StatCard
          label="Customers"
          value={String(customers.length)}
          icon={Users}
          hint="Unique buyers"
        />
        <StatCard
          label="Products"
          value={String(productData?.data?.total ?? 0)}
          icon={Package}
          hint="Live in catalog"
        />
      </div>

      <Card>
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors"
          >
            View all <ArrowUpRight size={15} />
          </Link>
        </div>

        {isLoading ? (
          <LoadingRows />
        ) : recent.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Orders will appear here as soon as customers start checking out."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map((order) => (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="flex flex-wrap items-center gap-3 px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {order.customer?.fullName} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <StatusBadge status={order.orderStatus} />
                <StatusBadge status={order.paymentStatus} kind="payment" />
                <span className="font-semibold w-full sm:w-auto sm:text-right sm:min-w-24">
                  {formatMoney(order.grandTotal)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Overview;
