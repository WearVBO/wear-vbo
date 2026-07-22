import api from "@/lib/axios";

export const GUEST_ID_KEY = "guestId";

/** Reads the stored guest id, or "" on the server / when absent. */
export const getGuestId = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(GUEST_ID_KEY) || "";
};

export const clearGuestId = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_ID_KEY);
};

/** Creates a fresh guest session and stores the id. */
export const createGuestSession = async (): Promise<string> => {
  if (typeof window === "undefined") return "";

  const response = await api.post("/api/guest/session");
  const guestId: string = response.data?.data?.guestId || "";

  if (guestId) localStorage.setItem(GUEST_ID_KEY, guestId);
  return guestId;
};

/**
 * Returns a usable guest id, creating a session on first visit.
 * Never throws — an empty string means "could not establish a session".
 */
export const getGuestSession = async (): Promise<string> => {
  if (typeof window === "undefined") return "";

  const existing = getGuestId();
  if (existing) return existing;

  try {
    return await createGuestSession();
  } catch (err) {
    if (err instanceof Error) {
      console.error("Guest session request failed:", err.message);
    }
    return "";
  }
};
