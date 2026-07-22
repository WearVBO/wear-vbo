import { publicRequest } from "@/lib/apiClient";
import type {
  ApiEnvelope,
  Category,
  CouponPreview,
  ShippingMethod,
} from "@/lib/types";

export const getCategories = () =>
  publicRequest<ApiEnvelope<Category[]>>({ url: "/api/category", method: "GET" });

export const getShippingMethods = () =>
  publicRequest<ApiEnvelope<ShippingMethod[]>>({
    url: "/api/shipping",
    method: "GET",
  });

/**
 * Preview only — the real discount is recomputed at checkout, so always show
 * the total that the checkout response returns.
 */
export const validateCoupon = (code: string, subtotal: number) =>
  publicRequest<ApiEnvelope<CouponPreview>>({
    url: "/api/coupon/validate",
    method: "POST",
    data: { code, subtotal },
  });
