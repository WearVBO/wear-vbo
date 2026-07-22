"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingRows,
  PageHeader,
  formatDate,
  formatMoney,
} from "@/components/admin/ui/AdminUI";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import { getApiErrorMessage } from "@/lib/apiClient";

const CustomersTable = () => {
  const { customers, isLoading, error, mutate } = useAdminCustomers();
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const filtered = term
    ? customers.filter(
        (customer) =>
          customer.email.includes(term) ||
          customer.fullName?.toLowerCase().includes(term),
      )
    : customers;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customers"
        subtitle="Everyone who has placed an order in your store."
      />

      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          aria-label="Search customers"
          className="w-full rounded-full border border-gray-200 py-3 pl-12 pr-4 text-sm outline-none focus:border-black transition-colors"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr] items-center gap-4 border-b border-gray-100 bg-gray-50/60 px-6 py-4 text-sm font-medium">
          <span>Customer</span>
          <span>Phone</span>
          <span>Orders</span>
          <span>Last order</span>
          <span className="text-right">Total spent</span>
        </div>

        {isLoading ? (
          <LoadingRows />
        ) : error ? (
          <ErrorState
            message={getApiErrorMessage(error, "Could not load customers.")}
            onRetry={() => mutate()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No customers yet"
            description={
              term
                ? `Nothing matched "${query}".`
                : "Customers appear here once they place their first order."
            }
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((customer) => (
              <Link
                key={customer.email}
                href={`/admin/customers/${encodeURIComponent(customer.email)}`}
                className="grid grid-cols-1 md:grid-cols-[2fr_1.4fr_1fr_1fr_1fr] items-center gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark">
                    {customer.fullName?.[0]?.toUpperCase() || "?"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{customer.fullName}</p>
                    <p className="truncate text-sm text-gray-500">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <span className="text-sm text-gray-500">
                  {customer.phoneNumber || "—"}
                </span>
                <span className="text-sm">
                  {customer.orderCount} order
                  {customer.orderCount > 1 ? "s" : ""}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(customer.lastOrderAt)}
                </span>
                <span className="font-semibold md:text-right">
                  {formatMoney(customer.totalSpent)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomersTable;
