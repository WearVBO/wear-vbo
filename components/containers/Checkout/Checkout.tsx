"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { IoIosArrowForward } from "react-icons/io";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/hooks/useCart";
import { getApiErrorMessage } from "@/lib/apiClient";
import {
  getShippingMethods,
  validateCoupon,
} from "@/services/catalog.service";
import {
  createCheckout,
  persistCheckoutReference,
} from "@/services/checkout.service";
import type { CouponPreview } from "@/lib/types";

type CheckoutFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  billingCountry: string;
  billingState: string;
  billingCity: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingPostalCode: string;
};

const Checkout = () => {
  const pathname = usePathname();
  const { items, subtotal, unavailableItems } = useCart();

  const [shippingMethodId, setShippingMethodId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<CouponPreview | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // when true the shipping address is copied into billingAddress on submit —
  // billingAddress is always sent populated, never null
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: { country: "Nigeria", billingCountry: "Nigeria" },
    // drop the billing fields from the registry while they're hidden, so their
    // required rules can't block submission behind a collapsed section
    shouldUnregister: true,
  });

  const { data: shippingData } = useSWR(
    "/api/shipping",
    async () => (await getShippingMethods()).data,
    { revalidateOnFocus: false },
  );
  const shippingMethods = shippingData || [];
  const selectedShipping =
    shippingMethods.find((method) => method._id === shippingMethodId) || null;

  const links = [
    { name: "Home", link: "/" },
    { name: "Cart", link: "/cart" },
    { name: "Checkout", link: "/checkout" },
  ];

  const contactFields = [
    {
      label: "Full Name",
      name: "fullName" as const,
      type: "text",
      rules: {
        required: "Full name is required",
        minLength: { value: 2, message: "Full name is too short" },
      },
      colSpan: "col-span-2",
    },
    {
      label: "Email",
      name: "email" as const,
      type: "email",
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Enter a valid email address",
        },
      },
      colSpan: "col-span-2",
    },
    {
      label: "Phone Number",
      name: "phoneNumber" as const,
      type: "tel",
      rules: {
        required: "Phone number is required",
        minLength: { value: 7, message: "Enter a valid phone number" },
      },
      colSpan: "col-span-2",
    },
  ];

  const deliveryFields = [
    {
      label: "Country",
      name: "country" as const,
      type: "text",
      rules: { required: "Country is required" },
      colSpan: "col-span-1",
    },
    {
      label: "State",
      name: "state" as const,
      type: "text",
      rules: { required: "State is required" },
      colSpan: "col-span-1",
    },
    {
      label: "City",
      name: "city" as const,
      type: "text",
      rules: { required: "City is required" },
      colSpan: "col-span-1",
    },
    {
      label: "Postal Code (optional)",
      name: "postalCode" as const,
      type: "text",
      rules: {},
      colSpan: "col-span-1",
    },
    {
      label: "Address",
      name: "addressLine1" as const,
      type: "text",
      rules: { required: "Address is required" },
      colSpan: "col-span-2",
    },
    {
      label: "Apartment, suite, etc. (optional)",
      name: "addressLine2" as const,
      type: "text",
      rules: {},
      colSpan: "col-span-2",
    },
  ];

  // Required only when the customer unticks "same as delivery" — otherwise the
  // delivery address is copied over, so billingAddress is never empty.
  // `validate` rejects whitespace-only input, which `required` alone allows.
  const billingRules = (message: string) =>
    sameAsShipping
      ? {}
      : {
          required: message,
          validate: (value: string) =>
            (value || "").trim().length > 0 || message,
        };

  const billingFields = [
    {
      label: "Country",
      name: "billingCountry" as const,
      type: "text",
      rules: billingRules("Billing country is required"),
      colSpan: "col-span-1",
    },
    {
      label: "State",
      name: "billingState" as const,
      type: "text",
      rules: billingRules("Billing state is required"),
      colSpan: "col-span-1",
    },
    {
      label: "City",
      name: "billingCity" as const,
      type: "text",
      rules: billingRules("Billing city is required"),
      colSpan: "col-span-1",
    },
    {
      label: "Postal Code (optional)",
      name: "billingPostalCode" as const,
      type: "text",
      rules: {},
      colSpan: "col-span-1",
    },
    {
      label: "Billing address",
      name: "billingAddressLine1" as const,
      type: "text",
      rules: billingRules("Billing address is required"),
      colSpan: "col-span-2",
    },
    {
      label: "Apartment, suite, etc. (optional)",
      name: "billingAddressLine2" as const,
      type: "text",
      rules: {},
      colSpan: "col-span-2",
    },
  ];

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    try {
      const response = await validateCoupon(couponCode.trim(), subtotal);
      setCoupon(response.data);
      toast.success(response.message || "Coupon applied");
    } catch (err) {
      setCoupon(null);
      setCouponError(getApiErrorMessage(err, "This coupon is not valid."));
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (unavailableItems.length > 0) {
      toast.error("Some items in your cart are unavailable");
      return;
    }

    const shippingAddress = {
      country: data.country,
      state: data.state,
      city: data.city,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || "",
      postalCode: data.postalCode || "",
    };

    // Always populated — a copy of the delivery address, or the separate one
    // the customer entered. Never null.
    const billingAddress = sameAsShipping
      ? { ...shippingAddress }
      : {
          country: data.billingCountry,
          state: data.billingState,
          city: data.billingCity,
          addressLine1: data.billingAddressLine1,
          addressLine2: data.billingAddressLine2 || "",
          postalCode: data.billingPostalCode || "",
        };

    setIsSubmitting(true);
    try {
      // No cart items and no money values — the server owns both.
      const response = await createCheckout({
        customer: {
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
        shippingAddress,
        billingAddress,
        ...(coupon ? { couponCode: coupon.code } : {}),
        ...(selectedShipping
          ? {
              shippingMethodId: selectedShipping._id,
              deliveryMethod: selectedShipping.name,
            }
          : {}),
        currency: "NGN",
      });

      persistCheckoutReference(response.data);
      window.location.href = response.data.paymentLink;
    } catch (err) {
      // 400 = empty cart / validation, 409 = out of stock or unavailable
      toast.error(getApiErrorMessage(err, "Could not start checkout."));
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 md:px-10 py-6">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        {links.map((link, index) => {
          const isActive = pathname === link.link;
          return (
            <React.Fragment key={index}>
              <Link
                href={link.link}
                className={
                  isActive ? "text-black font-semibold" : "text-gray-500"
                }
              >
                {link.name}
              </Link>
              {index < links.length - 1 && (
                <IoIosArrowForward className="text-gray-400" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* left: customer + delivery */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <h2 className="font-bold uppercase tracking-widest text-sm mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {contactFields.map((field) => (
                <div key={field.name} className={field.colSpan}>
                  <input
                    {...register(field.name, field.rules)}
                    type={field.type}
                    placeholder={field.label}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold uppercase tracking-widest text-sm mb-4">
              Delivery Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {deliveryFields.map((field) => (
                <div key={field.name} className={field.colSpan}>
                  <input
                    {...register(field.name, field.rules)}
                    type={field.type}
                    placeholder={field.label}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* billing address */}
          <div>
            <h2 className="font-bold uppercase tracking-widest text-sm mb-4">
              Billing Address
            </h2>

            <label className="flex items-center gap-3 mb-4 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
                className="h-4 w-4 accent-black"
              />
              Same as delivery address
            </label>

            {sameAsShipping ? (
              <p className="text-xs text-gray-500">
                Your delivery address will be used for billing.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {billingFields.map((field) => (
                  <div key={field.name} className={field.colSpan}>
                    <input
                      {...register(field.name, field.rules)}
                      type={field.type}
                      placeholder={field.label}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* shipping method */}
          {shippingMethods.length > 0 && (
            <div>
              <h2 className="font-bold uppercase tracking-widest text-sm mb-4">
                Delivery Method
              </h2>
              <div className="flex flex-col gap-2">
                {shippingMethods.map((method) => (
                  <label
                    key={method._id}
                    className={`flex items-center justify-between border rounded-md px-4 py-3 text-sm cursor-pointer ${
                      shippingMethodId === method._id
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method._id}
                        checked={shippingMethodId === method._id}
                        onChange={() => setShippingMethodId(method._id)}
                      />
                      <span>
                        <span className="font-medium">{method.name}</span>
                        {method.estimatedDays && (
                          <span className="text-gray-500">
                            {" "}
                            · {method.estimatedDays}
                          </span>
                        )}
                      </span>
                    </span>
                    <span>₦{method.fee.toLocaleString()}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* coupon */}
          <div>
            <h2 className="font-bold uppercase tracking-widest text-sm mb-4">
              Discount Code
            </h2>
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-sm"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="border border-black rounded-md px-6 text-sm font-semibold hover:bg-black hover:text-white transition"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="text-red-500 text-xs mt-1">{couponError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Redirecting to payment..." : "Proceed to Payment"}
          </button>
        </form>

        {/* order summary */}
        <div className="h-fit flex flex-col gap-4">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <OrderSummary shippingMethod={selectedShipping} coupon={coupon} />
        </div>
      </div>
    </section>
  );
};

export default Checkout;
