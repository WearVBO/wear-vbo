import api from "@/lib/axios";

export const getGuestSession = async (): Promise<string> => {
  if (typeof window === "undefined") return "";

  let guestToken = localStorage.getItem("guestToken");

  // check if token is expired or empty
  if (guestToken && guestToken.trim() !== "") {
    try {
      // decode token to check expiry
      const payload = JSON.parse(atob(guestToken.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        // console.log("Guest token expired, creating new one...");
        localStorage.removeItem("guestToken");
        localStorage.removeItem("guestId");
        guestToken = null;
      }
    } catch {
      // invalid token format — clear it
      localStorage.removeItem("guestToken");
      guestToken = null;
    }
  }

  if (!guestToken || guestToken.trim() === "") {
    try {
      const response = await api.post("/api/guest/session");
      guestToken = response.data.guestToken;
      const guestId = response.data.guestId;
      localStorage.setItem("guestToken", guestToken!);
      localStorage.setItem("guestId", guestId);
    } catch (err) {
      if (err instanceof Error) {
        console.error("POST failed:", err.message);
      }
      return "";
    }
  }

  return guestToken || "";
};