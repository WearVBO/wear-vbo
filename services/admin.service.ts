import { adminRequest } from "@/lib/apiClient";
import type {
  AdminProductPayload,
  AdminVariantPayload,
  ApiEnvelope,
  Order,
  OrderStatus,
  Paginated,
  PaymentStatus,
  Product,
  ProductVariant,
  TrackedOrder,
} from "@/lib/types";

/* ---------------------------------- orders --------------------------------- */

export interface AdminOrderQuery {
  page?: number;
  limit?: number;
  orderStatus?: OrderStatus | "";
  paymentStatus?: PaymentStatus | "";
  email?: string;
}

export const buildAdminOrderUrl = (query: AdminOrderQuery = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return `/api/order/admin/list${qs ? `?${qs}` : ""}`;
};

/**
 * The list response shape isn't pinned down in the API docs, so accept either
 * a bare array or the paginated envelope the product list uses.
 */
export const normalizeOrderList = (payload: unknown): Paginated<Order> => {
  const empty: Paginated<Order> = {
    page: 1,
    limit: 0,
    total: 0,
    totalPages: 1,
    data: [],
  };
  if (!payload) return empty;
  if (Array.isArray(payload)) {
    return { ...empty, total: payload.length, data: payload as Order[] };
  }

  const record = payload as Partial<Paginated<Order>> & { orders?: Order[] };
  const data = record.data ?? record.orders ?? [];
  return {
    page: record.page ?? 1,
    limit: record.limit ?? data.length,
    total: record.total ?? data.length,
    totalPages: record.totalPages ?? 1,
    data,
  };
};

export const listOrders = async (url: string) => {
  const response = await adminRequest<ApiEnvelope<unknown>>({
    url,
    method: "GET",
  });
  return normalizeOrderList(response.data);
};

export const getOrder = (orderId: string) =>
  adminRequest<ApiEnvelope<TrackedOrder>>({
    url: `/api/order/admin/${orderId}`,
    method: "GET",
  });

export const updateOrderStatus = (orderId: string, orderStatus: OrderStatus) =>
  adminRequest<ApiEnvelope<Order>>({
    url: `/api/order/admin/${orderId}/status`,
    method: "PATCH",
    data: { orderStatus },
  });

/* --------------------------------- products -------------------------------- */

/**
 * Field name the API expects for uploaded files. Matches the `productImages`
 * key on the product response — change here if the backend differs.
 */
export const PRODUCT_IMAGE_FIELD = "productImages";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES = 6;

/**
 * Product create/edit are multipart endpoints, so text fields and files go in
 * one FormData body. Content-Type is left unset so axios attaches the
 * boundary itself — setting it manually breaks the upload.
 */
const toProductFormData = (
  payload: Partial<AdminProductPayload>,
  images: File[] = [],
) => {
  const form = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, String(value));
    }
  });

  images.forEach((file) => form.append(PRODUCT_IMAGE_FIELD, file));
  return form;
};

/** Rejects non-images and oversized files before they hit the network. */
export const validateImageFiles = (files: File[]): string | null => {
  if (files.length > MAX_IMAGES) {
    return `You can upload up to ${MAX_IMAGES} images.`;
  }
  const badType = files.find((file) => !file.type.startsWith("image/"));
  if (badType) return `"${badType.name}" is not an image.`;

  const tooLarge = files.find((file) => file.size > MAX_IMAGE_BYTES);
  if (tooLarge) {
    return `"${tooLarge.name}" is larger than ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`;
  }
  return null;
};

export const createProduct = (
  payload: AdminProductPayload,
  images: File[] = [],
) =>
  adminRequest<ApiEnvelope<Product>>({
    url: "/api/product/create-products",
    method: "POST",
    data: toProductFormData(payload, images),
  });

export const updateProduct = (
  productId: string,
  payload: Partial<AdminProductPayload>,
  images: File[] = [],
) =>
  adminRequest<ApiEnvelope<Product>>({
    url: `/api/product/edit-product/${productId}`,
    method: "PATCH",
    data: toProductFormData(payload, images),
  });

export const createVariant = (
  productId: string,
  payload: AdminVariantPayload,
) =>
  adminRequest<ApiEnvelope<ProductVariant>>({
    url: `/api/product/${productId}/variants`,
    method: "POST",
    data: payload,
  });

export const updateVariant = (
  variantId: string,
  payload: Partial<AdminVariantPayload> & { isActive?: boolean },
) =>
  adminRequest<ApiEnvelope<ProductVariant>>({
    url: `/api/product/variants/${variantId}`,
    method: "PATCH",
    data: payload,
  });
