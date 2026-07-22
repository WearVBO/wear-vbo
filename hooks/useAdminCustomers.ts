"use client";
import useSWR from "swr";
import { buildAdminOrderUrl, listOrders } from "@/services/admin.service";
import type { DerivedCustomer, Order } from "@/lib/types";

/**
 * The API exposes no /users endpoint, so the customer directory is aggregated
 * from orders — one record per unique customer email.
 */
export const aggregateCustomers = (orders: Order[]): DerivedCustomer[] => {
  const byEmail = new Map<string, DerivedCustomer>();

  orders.forEach((order) => {
    const email = order.customer?.email?.toLowerCase();
    if (!email) return;

    const existing = byEmail.get(email);
    const paid = order.paymentStatus === "paid" ? order.grandTotal : 0;

    if (!existing) {
      byEmail.set(email, {
        email,
        fullName: order.customer.fullName,
        phoneNumber: order.customer.phoneNumber,
        orderCount: 1,
        totalSpent: paid,
        lastOrderAt: order.createdAt,
        lastOrderNumber: order.orderNumber,
        orders: [order],
      });
      return;
    }

    existing.orderCount += 1;
    existing.totalSpent += paid;
    existing.orders.push(order);
    if (new Date(order.createdAt) > new Date(existing.lastOrderAt)) {
      existing.lastOrderAt = order.createdAt;
      existing.lastOrderNumber = order.orderNumber;
      existing.fullName = order.customer.fullName;
      existing.phoneNumber = order.customer.phoneNumber;
    }
  });

  return [...byEmail.values()].sort(
    (a, b) =>
      new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime(),
  );
};

export const useAdminCustomers = () => {
  const url = buildAdminOrderUrl({ page: 1, limit: 200 });
  const { data, isLoading, error, mutate } = useSWR(
    ["admin-customers", url],
    () => listOrders(url),
    { revalidateOnFocus: false },
  );

  const orders = data?.data ?? [];

  return {
    customers: aggregateCustomers(orders),
    orders,
    isLoading,
    error,
    mutate,
  };
};
