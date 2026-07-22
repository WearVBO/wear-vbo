import axios from "axios";
import api from "@/lib/axios";
import { adminRequest } from "@/lib/apiClient";
import type { AdminUser } from "@/lib/adminAuth";
import type { ApiEnvelope } from "@/lib/types";

export interface AdminLoginResult {
  token: string;
  admin: AdminUser;
}

export interface CreateAdminPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  /** Typed by the operator at submit time — never stored or bundled. */
  adminSecret: string;
}

export interface CreateAdminResult {
  admin: AdminUser;
  /** Token for the NEW admin. Must be discarded — never swap the session. */
  token?: string;
}

/** Public. Rate limited to 10 requests / 15 min per IP. */
export const adminLogin = async (email: string, password: string) => {
  const response = await api.post<ApiEnvelope<AdminLoginResult>>(
    "/api/admin/login",
    { email, password },
  );
  return response.data;
};

/**
 * Requires both an admin Bearer token and the server's ADMIN_SECRET in the
 * body. `allow403` keeps the session alive when the secret is wrong.
 */
export const createAdmin = (payload: CreateAdminPayload) =>
  adminRequest<ApiEnvelope<CreateAdminResult>>(
    { url: "/api/admin/create", method: "POST", data: payload },
    { allow403: true },
  );

/**
 * Server-side no-op — the JWT is not invalidated. The caller must clear
 * local storage and redirect regardless of the outcome.
 */
export const adminLogout = async () => {
  try {
    await adminRequest({ url: "/api/admin/logout", method: "POST" });
  } catch {
    // deliberately ignored — logout must always succeed locally
  }
};

/** Maps admin login failures to the copy specified for each status. */
export const getAdminLoginError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) return "Something went wrong. Please try again.";

  switch (error.response?.status) {
    case 401:
      return "Invalid email or password";
    case 403:
      return "This account does not have admin access";
    case 429:
      return "Too many attempts. Try again later.";
    default:
      return (
        error.response?.data?.message ||
        "Could not sign you in. Please try again."
      );
  }
};

/** Maps create-admin failures. A 403 here means a bad secret, not a dead session. */
export const getCreateAdminError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) return "Something went wrong. Please try again.";

  switch (error.response?.status) {
    case 400:
      return "An account with this email already exists";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "Invalid admin secret";
    case 429:
      return "Too many attempts. Try again later.";
    default:
      return (
        error.response?.data?.message ||
        "Could not create this admin. Please try again."
      );
  }
};
