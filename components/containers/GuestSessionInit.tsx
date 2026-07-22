"use client";
import { useEffect } from "react";
import { getGuestSession } from "@/lib/guestSession";

/**
 * Bootstraps the guest id on first visit. Shopping is public, so this runs
 * for everyone — the id is what identifies the cart from here on.
 */
const GuestSessionInit = () => {
  useEffect(() => {
    getGuestSession();
  }, []);

  return null;
};

export default GuestSessionInit;