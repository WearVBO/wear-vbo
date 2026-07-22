// Shared response types for the public guest-checkout API.

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

/* ---------------------------------- guest --------------------------------- */

export interface GuestSession {
  guestId: string;
  expiresAt: string;
}

/* -------------------------------- catalogue -------------------------------- */

export interface ProductImage {
  url: string;
  publicId: string;
  _id: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImages: ProductImage[];
  ratings: number;
  sizes: string[];
  tags: string[];
  availableColors: string[];
  category: Category | null;
  isActive: boolean;
  hasVariants: boolean;
}

export interface ProductVariant {
  _id: string;
  product: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  isActive: boolean;
  stock: number;
}

export interface RelatedProduct {
  _id: string;
  productName: string;
  productPrice: number;
  productImages: ProductImage[];
  ratings: number;
}

export interface SingleProduct {
  product: Product;
  variants: ProductVariant[];
  /** base stock, used when the product has no variants */
  stock: number;
  related: RelatedProduct[];
}

export interface PaginatedProducts {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Product[];
}

/* ----------------------------------- cart ---------------------------------- */

export interface CartItem {
  productId: string;
  variantId: string | null;
  productName: string;
  image: string;
  attributes: { size?: string; color?: string } | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stock: number;
  inStock: boolean;
  isActive: boolean;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

/** A cart line is identified by productId + variantId together. */
export const cartLineKey = (item: {
  productId: string;
  variantId: string | null;
}) => `${item.productId}:${item.variantId ?? "base"}`;

/* --------------------------------- shipping -------------------------------- */

export interface ShippingMethod {
  _id: string;
  name: string;
  description?: string;
  fee: number;
  estimatedDays?: string;
}

/* --------------------------------- coupons --------------------------------- */

export interface CouponPreview {
  code: string;
  type: string;
  value: number;
  discount: number;
}

/* --------------------------------- checkout -------------------------------- */

export interface CheckoutCustomer {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface Address {
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
}

export interface CheckoutPayload {
  customer: CheckoutCustomer;
  shippingAddress: Address;
  /** Required and always populated — never null. */
  billingAddress: Address;
  couponCode?: string;
  deliveryMethod?: string;
  shippingMethodId?: string;
  currency?: string;
  paymentMethod?: string;
}

export interface CheckoutResult {
  orderNumber: string;
  orderId: string;
  /** tx_ref — persist this before redirecting */
  reference: string;
  amount: number;
  currency: string;
  paymentLink: string;
}

/* --------------------------------- payment --------------------------------- */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export interface PaymentVerification {
  orderNumber: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  /** present when verification failed */
  reason?: string;
}

export interface PaymentStatusResult {
  reference: string;
  paymentStatus: PaymentStatus;
  order: {
    orderNumber: string;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    grandTotal: number;
    currency: string;
  };
}

/* ---------------------------------- orders --------------------------------- */

export interface OrderLine {
  productId: string;
  variantId: string | null;
  productName: string;
  image?: string;
  attributes?: { size?: string; color?: string } | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderLine[];
  customer: CheckoutCustomer;
  shippingAddress: Address;
  billingAddress?: Address | null;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  taxTotal: number;
  grandTotal: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Paginated<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

export interface OrderTimelineEntry {
  status: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface TrackedOrder {
  order: Order;
  timeline: OrderTimelineEntry[];
}

/* ---------------------------------- admin ---------------------------------- */

/** A customer record aggregated from orders — the API has no /users endpoint. */
export interface DerivedCustomer {
  email: string;
  fullName: string;
  phoneNumber: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  lastOrderNumber: string;
  orders: Order[];
}

export interface AdminProductPayload {
  productName: string;
  productDescription: string;
  productPrice: number;
  category?: string;
  stock?: number;
  isActive?: boolean;
}

export interface AdminVariantPayload {
  sku: string;
  size: string;
  color: string;
  price: number;
  stock: number;
}
