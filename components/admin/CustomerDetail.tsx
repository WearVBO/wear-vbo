"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  StatusBadge,
  formatDate,
  formatMoney,
} from "@/components/admin/ui/AdminUI";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import { getApiErrorMessage } from "@/lib/apiClient";

const CustomerDetail = ({ email }: { email: string }) => {
  const { customers, isLoading, error, mutate } = useAdminCustomers();
  const customer = customers.find(
    (item) => item.email === email.toLowerCase(),
  );

  if (isLoading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    );

  if (error)
    return (
      <ErrorState
        message={getApiErrorMessage(error, "Could not load this customer.")}
        onRetry={() => mutate()}
      />
    );

  if (!customer)
    return (
      <EmptyState
        title="Customer not found"
        description={`No orders are associated with ${email}.`}
      />
    );

  const latest = customer.orders[0];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft size={16} /> Back to customers
      </Link>

      <PageHeader title={customer.fullName} subtitle={customer.email} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="mt-2 text-2xl font-semibold">{customer.orderCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Total spent</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatMoney(customer.totalSpent)}
          </p>
          <p className="mt-1 text-xs text-gray-400">Paid orders only</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Last order</p>
          <p className="mt-2 text-2xl font-semibold">
            {customer.lastOrderNumber}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {formatDate(customer.lastOrderAt)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* orders */}
        <Card className="overflow-hidden lg:col-span-2">
          <h2 className="border-b border-gray-100 px-4 md:px-6 py-4 font-semibold">
            Order history
          </h2>
          <div className="divide-y divide-gray-100">
            {customer.orders.map((order) => (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="flex flex-wrap items-center gap-3 px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <StatusBadge status={order.orderStatus} />
                <StatusBadge status={order.paymentStatus} kind="payment" />
                <span className="font-semibold">
                  {formatMoney(order.grandTotal)}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        {/* contact */}
        <Card className="h-fit p-4 md:p-6">
          <h2 className="mb-3 font-semibold">Contact</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Email</dt>
              <dd className="break-all text-right font-medium">
                {customer.email}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Phone</dt>
              <dd className="font-medium">{customer.phoneNumber || "—"}</dd>
            </div>
          </dl>

          {latest?.shippingAddress && (
            <>
              <h2 className="mb-2 mt-6 font-semibold">Last known address</h2>
              <p className="text-sm leading-6 text-gray-600">
                {latest.shippingAddress.addressLine1}
                <br />
                {latest.shippingAddress.city}, {latest.shippingAddress.state}
                <br />
                {latest.shippingAddress.country}
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetail;
