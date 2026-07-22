import { publicRequest } from "@/lib/apiClient";
import type { ApiEnvelope, TrackedOrder } from "@/lib/types";

/** Both the order number and the matching customer email are required. */
export const trackOrder = (orderNumber: string, email: string) =>
  publicRequest<ApiEnvelope<TrackedOrder>>({
    url: `/api/order/track/${encodeURIComponent(
      orderNumber,
    )}?email=${encodeURIComponent(email)}`,
    method: "GET",
  });
