"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { getApiErrorMessage } from "@/lib/apiClient";
import { trackOrder } from "@/services/order.service";
import type { TrackedOrder } from "@/lib/types";

type TrackFormData = {
  orderNumber: string;
  email: string;
};

const TrackOrder = () => {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackFormData>({
    defaultValues: { orderNumber: searchParams?.get("orderNumber") || "" },
  });

  const onSubmit = async (data: TrackFormData) => {
    setErrorMessage("");
    setResult(null);
    try {
      const response = await trackOrder(data.orderNumber.trim(), data.email.trim());
      setResult(response.data);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err, "We could not find that order."));
    }
  };

  const order = result?.order;
  const timeline = result?.timeline || [];

  return (
    <section className="px-4 md:px-10 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Track your order</h1>
      <p className="text-gray-500 text-sm mb-8">
        Enter your order number and the email you used at checkout.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mb-10"
      >
        <div>
          <input
            {...register("orderNumber", {
              required: "Order number is required",
            })}
            placeholder="Order number (e.g. GM-20260721-4F9A2C)"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
          />
          {errors.orderNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.orderNumber.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            type="email"
            placeholder="Email address"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition disabled:bg-gray-300"
        >
          {isSubmitting ? "Looking up..." : "Track order"}
        </button>
        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}
      </form>

      {order && (
        <div className="flex flex-col gap-8">
          {/* header */}
          <div className="border rounded-xl p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-bold">{order.orderNumber}</h2>
              <span className="text-xs uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                {order.orderStatus}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Payment: {order.paymentStatus}
            </p>
          </div>

          {/* progress stepper */}
          {timeline.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-4">
                Progress
              </h3>
              <ol className="flex flex-col">
                {timeline.map((entry, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="w-3 h-3 rounded-full bg-black mt-1.5" />
                      {index < timeline.length - 1 && (
                        <span className="w-px flex-1 bg-gray-200" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold">{entry.title}</p>
                      <p className="text-sm text-gray-500">
                        {entry.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* items */}
          <div>
            <h3 className="font-bold uppercase tracking-widest text-sm mb-4">
              Items
            </h3>
            <div className="flex flex-col gap-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 relative overflow-hidden flex-shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      Qty {item.quantity}
                      {item.attributes?.size
                        ? ` · ${item.attributes.size}`
                        : ""}
                    </p>
                  </div>
                  <span className="font-semibold">
                    ₦{item.lineTotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* totals — all server-computed */}
          <div className="border rounded-xl p-6 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₦{order.discountTotal.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₦{order.shippingFee.toLocaleString()}</span>
            </div>
            {order.taxTotal > 0 && (
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₦{order.taxTotal.toLocaleString()}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₦{order.grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* delivery address */}
          <div>
            <h3 className="font-bold uppercase tracking-widest text-sm mb-2">
              Delivery Address
            </h3>
            <p className="text-sm text-gray-600 leading-6">
              {order.customer.fullName}
              <br />
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2
                ? `, ${order.shippingAddress.addressLine2}`
                : ""}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrackOrder;
