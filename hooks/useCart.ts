"use client";
import useSWR from "swr";
import { getCart } from "@/services/cart.service";
import type { CartSummary } from "@/lib/types";

/** Shared SWR key so every cart consumer revalidates together. */
export const CART_KEY = "cart-summary";

const EMPTY_CART: CartSummary = { items: [], subtotal: 0, itemCount: 0 };

export const useCart = () => {
  const { data, isLoading, error, mutate } = useSWR(
    CART_KEY,
    async () => (await getCart()).data,
    { revalidateOnFocus: false },
  );

  const cart = data ?? EMPTY_CART;

  return {
    cart,
    items: cart.items,
    subtotal: cart.subtotal,
    itemCount: cart.itemCount,
    /** lines the backend flagged as out of stock or no longer purchasable */
    unavailableItems: cart.items.filter(
      (item) => !item.inStock || !item.isActive,
    ),
    isLoading,
    error,
    mutate,
  };
};
