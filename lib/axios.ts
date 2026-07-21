// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://green-mart-backend.onrender.com",
});

export default api;