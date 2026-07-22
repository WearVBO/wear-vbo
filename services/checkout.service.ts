import { guestRequest } from "@/lib/apiClient";
import type { ApiEnvelope, CheckoutPayload, CheckoutResult } from "@/lib/types";

export const CHECKOUT_REFERENCE_KEY = "checkoutReference";
export const CHECKOUT_ORDER_NUMBER_KEY = "checkoutOrderNumber";

/**
 * The cart is read server-side from the guest session, and every money value
 * is recalculated by the backend — never send items, prices or totals.
 */
export const createCheckout = (payload: CheckoutPayload) =>
  guestRequest<ApiEnvelope<CheckoutResult>>({
    url: "/api/checkout",
    method: "POST",
    data: payload,
  });

export const persistCheckoutReference = (result: CheckoutResult) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHECKOUT_REFERENCE_KEY, result.reference);
  localStorage.setItem(CHECKOUT_ORDER_NUMBER_KEY, result.orderNumber);
};

export const getCheckoutReference = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(CHECKOUT_REFERENCE_KEY) || "";
};

export const clearCheckoutReference = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHECKOUT_REFERENCE_KEY);
  localStorage.removeItem(CHECKOUT_ORDER_NUMBER_KEY);
};
