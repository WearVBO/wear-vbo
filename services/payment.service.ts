import { publicRequest } from "@/lib/apiClient";
import type {
  ApiEnvelope,
  PaymentStatusResult,
  PaymentVerification,
} from "@/lib/types";

export interface VerifyParams {
  tx_ref: string;
  transaction_id: string;
  status: string;
}

/**
 * The only source of truth on the redirect-back page — the `status` query
 * param from Flutterwave is never trusted on its own.
 *
 * Note: a failed verification still returns HTTP 200; check `success`.
 */
export const verifyPayment = (params: VerifyParams) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  return publicRequest<ApiEnvelope<PaymentVerification>>({
    url: `/api/payment/verify?${query.toString()}`,
    method: "GET",
  });
};

export const getPaymentStatus = (reference: string) =>
  publicRequest<ApiEnvelope<PaymentStatusResult>>({
    url: `/api/payment/status/${reference}`,
    method: "GET",
  });
