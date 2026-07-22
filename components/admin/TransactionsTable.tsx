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
import type { Order, PaymentStatus } from "@/lib/types";

const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "cancelled",
  "refunded",
];

const referenceOf = (order: Order) =>
  (order as unknown as { paymentReference?: string; reference?: string })
    .paymentReference ||
  (order as unknown as { reference?: string }).reference ||
  "—";

const TransactionsTable = () => {
  const [page, setPage] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [email, setEmail] = useState("");

  const url = buildAdminOrderUrl({
    page,
    limit: 10,
    paymentStatus,
    email: email.trim(),
  });

  const { data, isLoading, error, mutate } = useSWR(
    ["admin-transactions", url],
    () => listOrders(url),
    { revalidateOnFocus: false, keepPreviousData: true },
  );

  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const collected = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.grandTotal, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transactions"
        subtitle="Payment activity across all orders."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-gray-500">Collected on this page</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatMoney(collected)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Transactions</p>
          <p className="mt-2 text-2xl font-semibold">{orders.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Awaiting payment</p>
          <p className="mt-2 text-2xl font-semibold">
            {orders.filter((o) => o.paymentStatus === "pending").length}
          </p>
        </Card>
      </div>

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
        <select
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value as PaymentStatus | "");
            setPage(1);
          }}
          aria-label="Filter by payment status"
          className="rounded-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
        >
          <option value="">All payment statuses</option>
          {PAYMENT_STATUSES.map((status) => (
            <option key={status} value={status} className="capitalize">
              {status}
            </option>
          ))}
        </select>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.6fr_1.4fr_1fr_1fr_1fr] items-center gap-4 border-b border-gray-100 bg-gray-50/60 px-6 py-4 text-sm font-medium">
          <span>Reference</span>
          <span>Customer</span>
          <span>Status</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
        </div>

        {isLoading && !data ? (
          <LoadingRows />
        ) : error ? (
          <ErrorState
            message={getApiErrorMessage(error, "Could not load transactions.")}
            onRetry={() => mutate()}
          />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Payments appear here once customers complete checkout."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="grid grid-cols-1 md:grid-cols-[1.6fr_1.4fr_1fr_1fr_1fr] items-center gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm">
                    {referenceOf(order)}
                  </p>
                  <p className="text-xs text-gray-500">{order.orderNumber}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm">{order.customer?.fullName}</p>
                  <p className="truncate text-sm text-gray-500">
                    {order.customer?.email}
                  </p>
                </div>
                <span>
                  <StatusBadge status={order.paymentStatus} kind="payment" />
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </span>
                <span className="font-semibold md:text-right">
                  {formatMoney(order.grandTotal)}
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

export default TransactionsTable;
