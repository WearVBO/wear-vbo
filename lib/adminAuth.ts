/**
 * Admin session storage.
 *
 * Deliberately kept under keys distinct from the customer `token` and the
 * guest `guestId` — the two systems must never share headers or storage.
 */

export const ADMIN_TOKEN_KEY = "adminToken";
export const ADMIN_USER_KEY = "admin";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export const getAdminToken = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
};

export const getAdminUser = (): AdminUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
};

export const setAdminSession = (token: string, admin: AdminUser) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
};

export const clearAdminSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
};

export const isAdminSessionValid = () => {
  const admin = getAdminUser();
  return Boolean(getAdminToken()) && admin?.role === "ADMIN";
};

/** Clears the session and bounces to login. Used by the 401/403 interceptor. */
export const endAdminSession = (expired = true) => {
  clearAdminSession();
  if (typeof window === "undefined") return;
  window.location.href = `/admin/login${expired ? "?expired=1" : ""}`;
};
