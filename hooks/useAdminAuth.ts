"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearAdminSession,
  getAdminUser,
  isAdminSessionValid,
  type AdminUser,
} from "@/lib/adminAuth";
import { adminLogout } from "@/services/adminAuth.service";

/**
 * Guards every /admin route except /admin/login. This is a convenience
 * guard, not a security boundary — the API enforces 401/403 regardless.
 */
export const useAdminAuth = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (!isAdminSessionValid()) {
      clearAdminSession();
      router.replace("/admin/login");
      setChecked(true);
      return;
    }
    setAdmin(getAdminUser());
    setChecked(true);
  }, [router]);

  const logout = useCallback(async () => {
    await adminLogout();
    clearAdminSession();
    router.replace("/admin/login");
  }, [router]);

  return { checked, admin, isAuthenticated: Boolean(admin), logout };
};
