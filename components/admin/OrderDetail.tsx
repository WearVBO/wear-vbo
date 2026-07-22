"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import {
  AdminButton,
  Card,
  ErrorState,
  PageHeader,
  StatusBadge,
  formatDate,
  formatMoney,
} from "@/components/admin/ui/AdminUI";
import { getApiErrorMessage } from "@/lib/apiClient";
import { getOrder, updateOrderStatus } from "@/services/admin.service";
import { getPaymentStatus } from "@/services/payment.service";
import type { OrderStatus } from "@/lib/types";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium break-all">{value}</span>
  </div>
);

const OrderDetail = ({ orderId }: { orderId: string }) => {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<OrderStatus | "">("");

  const { data, isLoading, error, mutate } = useSWR(
    ["admin-order", orderId],
    async () => (await getOrder(orderId)).data,
  );

  const order = data?.order;
  const timeline = data?.timeline ?? [];

  // transaction details come from the payment service, keyed by the order's reference
  const reference =
    (order as unknown as { paymentReference?: string; reference?: string })
      ?.paymentReference ||
    (order as unknown as { reference?: string })?.reference ||
    "";

  const { data: transaction } = useSWR(
    reference ? ["payment-status", reference] : null,
    async () => (await getPaymentStatus(reference)).data,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  const handleStatusChange = async () => {
    if (!status) return;
    setSaving(true);
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      setStatus("");
      mutate();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not update this order."));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    );

  if (error || !order)
    return (
      <ErrorState
        message={getApiErrorMessage(error, "This order could not be loaded.")}
        onRetry={() => mutate()}
      />
    );

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <PageHeader
        title={order.orderNumber}
        subtitle={`Placed ${formatDate(order.createdAt)}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={order.orderStatus} />
            <StatusBadge status={order.paymentStatus} kind="payment" />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* items */}
          <Card className="overflow-hidden">
            <h2 className="border-b border-gray-100 px-4 md:px-6 py-4 font-semibold">
              Items
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 px-4 md:px-6 py-4"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {formatMoney(item.unitPrice)} × {item.quantity}
                      {item.attributes?.size
                        ? ` · ${item.attributes.size}`
                        : ""}
                      {item.attributes?.color
                        ? ` · ${item.attributes.color}`
                        : ""}
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatMoney(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* totals */}
            <div className="border-t border-gray-100 bg-gray-50/60 px-4 md:px-6 py-4">
              <Row label="Subtotal" value={formatMoney(order.subtotal)} />
              {order.discountTotal > 0 && (
                <Row
                  label="Discount"
                  value={`-${formatMoney(order.discountTotal)}`}
                />
              )}
              <Row label="Delivery" value={formatMoney(order.shippingFee)} />
              {order.taxTotal > 0 && (
                <Row label="Tax" value={formatMoney(order.taxTotal)} />
              )}
              <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-3 font-semibold">
                <span>Total</span>
                <span>{formatMoney(order.grandTotal)}</span>
              </div>
            </div>
          </Card>

          {/* timeline */}
          {timeline.length > 0 && (
            <Card className="p-4 md:p-6">
              <h2 className="mb-4 font-semibold">Timeline</h2>
              <ol className="flex flex-col">
                {timeline.map((entry, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-brand" />
                      {index < timeline.length - 1 && (
                        <span className="w-px flex-1 bg-gray-200" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-medium">{entry.title}</p>
                      <p className="text-sm text-gray-500">
                        {entry.description}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>

        {/* side column */}
        <div className="flex flex-col gap-6">
          {/* fulfilment */}
          <Card className="p-4 md:p-6">
            <h2 className="font-semibold">Update status</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              aria-label="Order status"
              className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm capitalize outline-none focus:border-black"
            >
              <option value="">Select a status</option>
              {ORDER_STATUSES.map((value) => (
                <option key={value} value={value} className="capitalize">
                  {value}
                </option>
              ))}
            </select>
            <AdminButton
              onClick={handleStatusChange}
              disabled={!status || saving}
              className="mt-3 w-full"
            >
              {saving ? "Updating..." : "Apply"}
            </AdminButton>
          </Card>

          {/* customer */}
          <Card className="p-4 md:p-6">
            <h2 className="mb-2 font-semibold">Customer</h2>
            <Row label="Name" value={order.customer?.fullName} />
            <Row label="Email" value={order.customer?.email} />
            <Row label="Phone" value={order.customer?.phoneNumber} />
            {order.customer?.email && (
              <Link
                href={`/admin/customers/${encodeURIComponent(order.customer.email)}`}
                className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
              >
                View customer
              </Link>
            )}
          </Card>

          {/* transaction */}
          <Card className="p-4 md:p-6">
            <h2 className="mb-2 font-semibold">Transaction</h2>
            <Row
              label="Payment"
              value={<StatusBadge status={order.paymentStatus} kind="payment" />}
            />
            <Row label="Amount" value={formatMoney(order.grandTotal)} />
            <Row label="Currency" value={order.currency || "NGN"} />
            {reference && <Row label="Reference" value={reference} />}
            {transaction && (
              <Row
                label="Verified status"
                value={
                  <StatusBadge
                    status={transaction.paymentStatus}
                    kind="payment"
                  />
                }
              />
            )}
            {!reference && (
              <p className="mt-2 text-xs text-gray-400">
                No payment reference recorded on this order.
              </p>
            )}
          </Card>

          {/* address */}
          <Card className="p-4 md:p-6">
            <h2 className="mb-2 font-semibold">Shipping address</h2>
            <p className="text-sm leading-6 text-gray-600">
              {order.shippingAddress?.addressLine1}
              {order.shippingAddress?.addressLine2
                ? `, ${order.shippingAddress.addressLine2}`
                : ""}
              <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state}
              <br />
              {order.shippingAddress?.country}
              {order.shippingAddress?.postalCode
                ? ` · ${order.shippingAddress.postalCode}`
                : ""}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
