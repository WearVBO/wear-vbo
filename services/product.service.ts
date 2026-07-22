import { publicRequest } from "@/lib/apiClient";
import type {
  ApiEnvelope,
  PaginatedProducts,
  ProductVariant,
  SingleProduct,
} from "@/lib/types";

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  collections?: string;
  color?: string;
  /** category _id from GET /api/category */
  category?: string;
}

export const buildProductUrl = (query: ProductQuery = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return `/api/product/get-products${qs ? `?${qs}` : ""}`;
};

export const getProducts = (url: string) =>
  publicRequest<ApiEnvelope<PaginatedProducts>>({ url, method: "GET" });

export const getSingleProduct = (productId: string) =>
  publicRequest<ApiEnvelope<SingleProduct>>({
    url: `/api/product/get-single-product/${productId}`,
    method: "GET",
  });

export const getProductVariants = (productId: string) =>
  publicRequest<ApiEnvelope<ProductVariant[]>>({
    url: `/api/product/${productId}/variants`,
    method: "GET",
  });
