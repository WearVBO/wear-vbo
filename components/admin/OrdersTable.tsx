"use client";
import React, { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Search } from "lucide-react";
import {
  AdminPagination,
  Card,
  EmptyState,
  ErrorState,
  LoadingRows,
  PageHeader,
  StatusBadge,
  formatDate,
  formatMoney,
} from "@/components/admin/ui/AdminUI";
import { buildAdminOrderUrl, listOrders } from "@/services/admin.service";
import { getApiErrorMessage } from "@/lib/apiClient";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "cancelled",
  "refunded",
];

const selectClass =
  "rounded-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors";

const OrdersTable = () => {
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");

  const url = buildAdminOrderUrl({
    page,
    limit: 10,
    email: email.trim(),
    orderStatus,
    paymentStatus,
  });

  const { data, isLoading, error, mutate } = useSWR(
    ["admin-orders", url],
    () => listOrders(url),
    { revalidateOnFocus: false, keepPreviousData: true },
  );

  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        subtitle="Every order processed through checkout."
      />

      {/* filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by customer email"
            aria-label="Filter by customer email"
            className="w-full rounded-full border border-gray-200 py-3 pl-12 pr-4 text-sm outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={orderStatus}
            onChange={(e) => {
              setOrderStatus(e.target.value as OrderStatus | "");
              setPage(1);
            }}
            aria-label="Filter by order status"
            className={selectClass}
          >
            <option value="">All order statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>

          <select
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value as PaymentStatus | "");
              setPage(1);
            }}
            aria-label="Filter by payment status"
            className={selectClass}
          >
            <option value="">All payment statuses</option>
            {PAYMENT_STATUSES.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.2fr_1.6fr_1fr_1fr_1fr_1fr] items-center gap-4 border-b border-gray-100 bg-gray-50/60 px-6 py-4 text-sm font-medium">
          <span>Order</span>
          <span>Customer</span>
          <span>Status</span>
          <span>Payment</span>
          <span>Date</span>
          <span className="text-right">Total</span>
        </div>

        {isLoading && !data ? (
          <LoadingRows />
        ) : error ? (
          <ErrorState
            message={getApiErrorMessage(error, "Could not load orders.")}
            onRetry={() => mutate()}
          />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="Try clearing your filters, or wait for your first sale."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="grid grid-cols-1 md:grid-cols-[1.2fr_1.6fr_1fr_1fr_1fr_1fr] items-center gap-3 md:gap-4 px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">{order.orderNumber}</span>

                <div className="min-w-0">
                  <p className="truncate text-sm">{order.customer?.fullName}</p>
                  <p className="truncate text-sm text-gray-500">
                    {order.customer?.email}
                  </p>
                </div>

                <span className="flex gap-2 md:block">
                  <StatusBadge status={order.orderStatus} />
                  <span className="md:hidden">
                    <StatusBadge status={order.paymentStatus} kind="payment" />
                  </span>
                </span>

                <span className="hidden md:block">
                  <StatusBadge status={order.paymentStatus} kind="payment" />
                </span>

                <span className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </span>

                <span className="font-semibold md:text-right">
                  {formatMoney(order.grandTotal, order.currency === "NGN" ? "₦" : "")}
                </span>
              </Link>
            ))}
          </div>
        )}

        <AdminPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
};

export default OrdersTable;
