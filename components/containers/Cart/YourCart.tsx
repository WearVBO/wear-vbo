"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { cartLineKey, type CartItem } from "@/lib/types";
import {
  clearCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart.service";
import { getApiErrorMessage } from "@/lib/apiClient";
import { CartSkeleton } from "@/components/containers/skeletons";

const YourCart = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { items, subtotal, unavailableItems, isLoading, error, mutate } =
    useCart();

  // per-line inline error, e.g. the 409 "Only 3 unit(s) available"
  const [lineErrors, setLineErrors] = useState<Record<string, string>>({});
  const [pendingLine, setPendingLine] = useState<string | null>(null);

  const links = [
    { name: "Home", path: "/" },
    { name: "Cart", path: "/cart" },
  ];

  const setLineError = (key: string, message: string | null) =>
    setLineErrors((prev) => {
      const next = { ...prev };
      if (message) next[key] = message;
      else delete next[key];
      return next;
    });

  const handleQuantityChange = async (item: CartItem, quantity: number) => {
    if (quantity < 0) return;
    const key = cartLineKey(item);
    setPendingLine(key);
    setLineError(key, null);
    try {
      // quantity 0 removes the line
      const response = await updateCartItem(
        item.productId,
        quantity,
        item.variantId,
      );
      mutate(response.data, { revalidate: false });
    } catch (err) {
      setLineError(key, getApiErrorMessage(err, "Could not update quantity."));
    } finally {
      setPendingLine(null);
    }
  };

  const handleRemoveItem = async (item: CartItem) => {
    const key = cartLineKey(item);
    setPendingLine(key);
    try {
      const response = await removeCartItem(item.productId, item.variantId);
      mutate(response.data, { revalidate: false });
      setLineError(key, null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to remove item."));
    } finally {
      setPendingLine(null);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setLineErrors({});
      mutate();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to clear cart."));
    }
  };

  const handleCheckout = () => {
    if (unavailableItems.length > 0) {
      toast.error("Remove the unavailable items before checking out");
      return;
    }
    router.push("/checkout");
  };

  if (isLoading) return <CartSkeleton />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {getApiErrorMessage(error, "Failed to load cart")}
      </div>
    );

  return (
    <section className="px-4 md:px-10 pt-4 pb-10 md:pt-10">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 ">
        {links.map((link, index) => {
          const isActive = pathname === link.path;
          return (
            <React.Fragment key={index}>
              <Link
                href={link.path}
                className={`${isActive ? "text-black font-semibold" : "text-gray-400"}`}
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

      <div className="flex items-center justify-between mt-4 md:mt-2">
        <h1 className="font-bold uppercase text-3xl">Your Cart</h1>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-sm text-red-500 hover:underline"
          >
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
          <Link
            href="/collections"
            className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* cart items */}
          <div className="md:col-span-2 flex flex-col gap-4 border rounded-xl mt-4">
            {items.map((item, index) => {
              const key = cartLineKey(item);
              const unavailable = !item.inStock || !item.isActive;
              return (
                <React.Fragment key={key}>
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden relative">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 animate-pulse" />
                      )}
                    </div>

                    {/* details */}
                    <div className="flex-1">
                      <p className="font-semibold">{item.productName}</p>
                      {item.attributes?.size && (
                        <p className="text-sm text-gray-500">
                          Size: {item.attributes.size}
                        </p>
                      )}
                      {item.attributes?.color && (
                        <p className="text-sm text-gray-500">
                          Color: {item.attributes.color}
                        </p>
                      )}
                      <p className="font-bold mt-1">
                        ₦{item.lineTotal.toLocaleString()}
                      </p>
                      {unavailable && (
                        <span className="inline-block mt-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          {item.isActive ? "Out of stock" : "Unavailable"}
                        </span>
                      )}
                      {lineErrors[key] && (
                        <p className="text-xs text-red-500 mt-1">
                          {lineErrors[key]}
                        </p>
                      )}
                    </div>

                    {/* quantity */}
                    <div className="flex flex-col items-center">
                      <div className="mb-4">
                        <button onClick={() => handleRemoveItem(item)}>
                          <RiDeleteBin5Line className="text-red-500 text-lg" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 border rounded-full px-3 py-1">
                        <button
                          disabled={pendingLine === key}
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                          className="text-lg disabled:text-gray-300"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          disabled={pendingLine === key}
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          className="text-lg disabled:text-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  {index < items.length - 1 && <hr className="mx-4" />}
                </React.Fragment>
              );
            })}
          </div>

          {/* summary — every money value comes from the server */}
          <div className="border rounded-xl p-6 h-fit flex flex-col gap-4">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            <p className="text-xs text-gray-500">
              Delivery, discounts and taxes are calculated at checkout.
            </p>

            <hr />

            {unavailableItems.length > 0 && (
              <p className="text-sm text-red-500">
                Remove the unavailable items above to continue.
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={unavailableItems.length > 0}
              className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors text-center block disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Go to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default YourCart;
