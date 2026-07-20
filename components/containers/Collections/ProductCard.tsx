"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
// import { usePathname } from 'next/navigation'
import { SlHandbag } from "react-icons/sl";
import { PiHeartStraight, PiHeartStraightFill } from "react-icons/pi";
import api from "@/lib/axios";
import toast from "react-hot-toast"
// import { getGuestSession } from "@/lib/guestSession";

export interface ProductCardProps {
  _id: string;
  productName: string;
  productPrice: number;
  productImages: { url: string; publicId: string, _id: string }[];
  isSoldOut: boolean;
  ratings: number;
  sizes: string[];
  availableColors: string[];
  tags: string[];
  // description: string; // 
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${
            star <= Math.floor(rating)
              ? "text-yellow-400"
              : star - 0.5 <= rating
                ? "text-yellow-300"
                : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
    </div>
  );
};

const ProductCard = ({ product }: { product: ProductCardProps }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const guestToken = localStorage.getItem("guestToken");
      const authToken = token || guestToken;
      // if (token) {
        //logged in user
        await api.post(
          "/api/cart/add-cart",
          {
            productId: product._id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        toast.success("Added to cart!")
      // }
      //  else {
        //guest user
        // const guestToken = await getGuestSession();
        // await api.post(
        //   "/api/cart/add-cart",
        //   {
        //     productId: product._id,
        //     quantity: 1,
        //   },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${guestToken}`,
        //     },
        //   },
        // );
        // alert("Added to cart!")
      // }
    } catch (error) {
      console.error("Failed to add to cart", error);
      alert("Failed to add to cart. Please try again.")
    }
  };
  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const guestToken = localStorage.getItem("guestToken");
      const authToken = token || guestToken;
      // if (!token) {
      //   alert("Please login to add to favorites");
      //   return;
      // }
      if (isFavorite) {
        await api.delete(`/api/favorites/${product._id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        await api.post(
          `/api/favorites/add`,
          { productId: product._id },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };
  return (
    <Link href={`/collections/product/${product._id}`} className="flex flex-col gap-4">
      {/* image container */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
        {product.productImages?.[0]?.url ? (
          <Image
            src={product.productImages[0].url || ""}
            alt={product.productName}
            fill
            priority 
            sizes = "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 animate-pulse" />
        )}

        {/* sold out badge */}
        {/* {product.isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className=" bg-white text-black text-xs px-3 py-1 rounded font-bold">
              SOLD OUT
            </span>
          </div>
        )} */}

        <button
          onClick={handleAddToCart}
          className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition-colors"
        >
          <SlHandbag size={16} />
        </button>

        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition-colors"
        >
          {isFavorite ? (
            <PiHeartStraightFill size={16} className="text-red-500" />
          ) : (
            <PiHeartStraight size={16} />
          )}
        </button>
      </div>

      {/* details */}
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg">{product.productName}</h3>
        <StarRating rating={product.ratings} />
        <p className="text-xl font-bold">₦{product.productPrice}</p>
        {/* <p className="text-gray-500">{product.description}</p> */}
      </div>
    </Link>
  );
};

export default ProductCard;
