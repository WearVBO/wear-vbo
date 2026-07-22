"use client";
import React from "react";
import { useCart } from "@/hooks/useCart";
import { cartLineKey } from "@/lib/types";
import { OrderSummarySkeleton } from "@/components/containers/skeletons";
import type { CouponPreview, ShippingMethod } from "@/lib/types";

interface OrderSummaryProps {
  shippingMethod?: ShippingMethod | null;
  coupon?: CouponPreview | null;
}

/**
 * Display only. Every figure here comes straight from the API — the binding
 * total is the `amount` returned by POST /api/checkout.
 */
const OrderSummary = ({ shippingMethod, coupon }: OrderSummaryProps) => {
  const { items, subtotal, isLoading, error } = useCart();

  if (isLoading) return <OrderSummarySkeleton />;
  if (error) return <div>Failed to load your cart</div>;
  if (items.length === 0) return <div>Your cart is empty</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* items */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={cartLineKey(item)} className="flex justify-between text-sm">
            <span>
              {item.productName}
              {item.attributes?.size ? ` (${item.attributes.size})` : ""} x
              {item.quantity}
            </span>
            <span>₦{item.lineTotal.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <hr />

      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>₦{subtotal.toLocaleString()}</span>
      </div>

      {coupon && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Coupon ({coupon.code})</span>
          <span>-₦{coupon.discount.toLocaleString()}</span>
        </div>
      )}

      {shippingMethod && (
        <div className="flex justify-between text-sm">
          <span>
            Delivery ({shippingMethod.name}
            {shippingMethod.estimatedDays
              ? `, ${shippingMethod.estimatedDays}`
              : ""}
            )
          </span>
          <span>₦{shippingMethod.fee.toLocaleString()}</span>
        </div>
      )}

      <hr />

      <p className="text-xs text-gray-500">
        Your final total is confirmed on the secure payment page.
      </p>
    </div>
  );
};

export default OrderSummary;
