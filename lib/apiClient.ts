import axios, { AxiosRequestConfig } from "axios";
import api from "@/lib/axios";
import {
  clearGuestId,
  createGuestSession,
  getGuestSession,
} from "@/lib/guestSession";
import { endAdminSession, getAdminToken } from "@/lib/adminAuth";

const EXPIRED_SESSION_MESSAGE = "Guest session not found or has expired";

const isExpiredGuestSession = (error: unknown) => {
  if (!axios.isAxiosError(error) || error.response?.status !== 404) return false;
  const message = String(error.response?.data?.message || "");
  return message.includes(EXPIRED_SESSION_MESSAGE);
};

/** Pulls the backend's user-facing `message` out of a failed request. */
export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message || fallback;
  return fallback;
};

/** True for the 409 the backend returns when a line exceeds available stock. */
export const isStockError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 409;

/**
 * Public request — no headers beyond the defaults.
 * Use for products, categories, shipping methods, coupons, payments and
 * order tracking.
 */
export const publicRequest = async <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.request<T>(config);
  return response.data;
};

/**
 * Guest request — attaches `x-guest-id`. Use for cart and checkout.
 * If the session has expired the id is discarded, a new session is created
 * and the request is retried exactly once.
 */
export const guestRequest = async <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const guestId = await getGuestSession();

  const send = (id: string) =>
    api.request<T>({
      ...config,
      headers: { ...config.headers, "x-guest-id": id },
    });

  try {
    const response = await send(guestId);
    return response.data;
  } catch (error) {
    if (!isExpiredGuestSession(error)) throw error;

    clearGuestId();
    const freshId = await createGuestSession();
    const response = await send(freshId);
    return response.data;
  }
};

export interface AdminRequestOptions {
  /**
   * Skip the global 403 → logout interceptor. Required for POST
   * /api/admin/create, where a 403 usually means a wrong `adminSecret`
   * rather than a dead session — logging the admin out there would be wrong.
   */
  allow403?: boolean;
}

/**
 * Admin request — the only place an Authorization header still belongs.
 * Sends the admin token only, never the guest id.
 *
 * A 401 (and, by default, a 403) clears the session and returns to login;
 * there is no refresh token, so an expired 24h JWT means logging in again.
 */
export const adminRequest = async <T>(
  config: AxiosRequestConfig,
  options: AdminRequestOptions = {},
): Promise<T> => {
  const token = getAdminToken();

  try {
    const response = await api.request<T>({
      ...config,
      headers: {
        ...config.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || (status === 403 && !options.allow403)) {
        endAdminSession();
      }
    }
    throw error;
  }
};

/** True for the 429 both admin auth endpoints return when rate limited. */
export const isRateLimited = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 429;
