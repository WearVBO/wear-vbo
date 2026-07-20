"use client";
import { useEffect } from "react";
import { getGuestSession } from "@/lib/guestSession";

const GuestSessionInit = () => {
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // always call getGuestSession — it handles expiry internally
          await getGuestSession();
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Guest session failed:", error.message);
        }
      }
    };
    init();
  }, []);

  return null;
};

export default GuestSessionInit;