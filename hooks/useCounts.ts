import useSWR from "swr";
import api from "@/lib/axios";
import { useCart } from "@/hooks/useCart";

export const useCartCount = () => {
  const { itemCount } = useCart();
  return itemCount;
};

// Favorites is still a user-account feature, so it keeps the user token.
const favoritesFetcher = async (url: string) => {
  const token =
    typeof window === "undefined" ? "" : localStorage.getItem("token") || "";
  if (!token) return null;

  const response = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const useFavoritesCount = () => {
  const { data } = useSWR("/api/favorites", favoritesFetcher, {
    revalidateOnFocus: false,
  });
  return data?.data?.length || 0;
};
