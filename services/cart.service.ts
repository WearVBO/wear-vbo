import { guestRequest } from "@/lib/apiClient";
import type { ApiEnvelope, CartSummary } from "@/lib/types";

type CartResponse = ApiEnvelope<CartSummary>;

export const getCart = () =>
  guestRequest<CartResponse>({ url: "/api/cart/get-cart", method: "GET" });

export const addToCart = (
  productId: string,
  quantity = 1,
  variantId: string | null = null,
) =>
  guestRequest<CartResponse>({
    url: "/api/cart/add-cart",
    method: "POST",
    data: { productId, variantId, quantity },
  });

/** Sets an absolute quantity. A quantity of 0 removes the line. */
export const updateCartItem = (
  productId: string,
  quantity: number,
  variantId: string | null = null,
) =>
  guestRequest<CartResponse>({
    url: "/api/cart/update-cart",
    method: "PATCH",
    data: { productId, variantId, quantity },
  });

export const removeCartItem = (
  productId: string,
  variantId: string | null = null,
) =>
  guestRequest<CartResponse>({
    url: `/api/cart/delete-cart/${productId}${
      variantId ? `?variantId=${variantId}` : ""
    }`,
    method: "DELETE",
  });

export const clearCart = () =>
  guestRequest<{ success: boolean; message: string }>({
    url: "/api/cart/clear-cart",
    method: "DELETE",
  });
