// lib/axios.ts
import axios from "axios";

/**
 * Public API client. Shopping, cart and checkout are fully public now —
 * no Authorization header is ever attached here. Guest identity travels
 * as the `x-guest-id` header, added per-request by lib/apiClient.ts.
 */
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://green-mart-backend.onrender.com",
});

export default api;
