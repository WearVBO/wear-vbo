"use client";
import React from "react";
import useSWR from "swr";
import api from "@/lib/axios";

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  const guestToken = localStorage.getItem("guestToken");
  const authToken = token || guestToken;

  const response = await api.get(url, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
  return response.data; 
}

const OrderSummary = () => {
  const { data, isLoading, error } = useSWR("/api/cart/get-cart", fetcher);
  const cartItems = data?.items || [];

  const subtotal = cartItems.reduce(
    (acc: number, item: { price: number; quantity: number }) =>
      acc + item.price * item.quantity,
    0,
  );
  const discount = Math.round(subtotal * 0.2);
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  const summaryItems = [
    {
      label: "Subtotal",
      value: `$${subtotal.toFixed(2)}`,
      style: "text-black",
    },
    {
      label: "Discount (20%)",
      value: `-$${discount.toFixed(2)}`,
      style: "text-red-500",
    },
    {
      label: "Delivery Fee",
      value: `$${deliveryFee.toFixed(2)}`,
      style: "text-black",
    },
    // { label: "Total", value: `$${total.toFixed(2)}`, isTotal: true },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Please login to view your cart</div>;
  return (
    <div>
      <div className="flex flex-col gap-4">
        {cartItems.map(
          (
            item: { id: number; name: string; price: number; quantity: number },
            index: number,
          ) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ),
        )}
      </div>
      <hr />

      {/* summary */}
      {summaryItems.map((item, index) => (
        <div
          key={index}
          className={`flex justify-between text-sm ${item.style}`}
        >
          <span>{item.label}</span>
          <span>{item.value}</span>
        </div>
      ))}

      <hr />

      {/* total */}
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
