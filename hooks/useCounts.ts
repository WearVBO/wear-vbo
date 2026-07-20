import useSWR from "swr";
import api from "@/lib/axios";
import { getGuestSession } from "@/lib/guestSession";
import axios from "axios";

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  let guestToken = localStorage.getItem("guestToken");

  if (!token) {
    guestToken = await getGuestSession();
  }

  const authToken = token || guestToken;

  try {
    return api
      .get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => res.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401 && token) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return null;
  }
};

export const useCartCount = () => {
  const { data } = useSWR("/api/cart/get-cart", fetcher, {
    revalidateOnFocus: false,
  });
  const cart = data?.cart?.items || data?.cart || [];
  return cart.length;
};

export const useFavoritesCount = () => {
  const { data } = useSWR("/api/favorites", fetcher, {
    revalidateOnFocus: false,
  });
  return data?.data?.length || 0;
};
