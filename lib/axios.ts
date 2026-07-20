// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://green-mart-backend.onrender.com",
});

export default api;