"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import api from "@/lib/axios";
import Image from "next/image";
import { PiHeartStraightFill, PiHeartStraight } from "react-icons/pi";
import { SlHandbag } from "react-icons/sl";
import { getGuestSession } from "@/lib/guestSession";
import toast from "react-hot-toast";

interface ProductImage {
  url: string;
  publicId: string;
  _id: string;
}

interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  ratings: number;
  sizes: string[];
  tags: string[];
  availableColors: string[];
  productImages: ProductImage[];
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  const guestToken = localStorage.getItem("guestToken");
  const authToken = token || guestToken;

  const response = await api.get(url, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
  return response.data;
};



const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${star <= Math.floor(rating) ? "text-yellow-400" : star - 0.5 <= rating ? "text-yellow-300" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating}</span>
    </div>
  );
};

const ProductDetail = ({ productId }: { productId: string }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const guestToken = localStorage.getItem("guestToken");
      if (!token && !guestToken) {
        await getGuestSession();
      }
      setAuthReady(true);
    };
    init();
  }, []);

  const { data, isLoading, error } = useSWR(
    authReady && productId
      ? `/api/product/get-single-product/${productId}`
      : null,
    fetcher,
  );
  console.log("fetching:", `/api/product/get-single-product/${productId}`);
  console.log("data", data);
  console.log("error", error);
  const product: Product = data?.data?.find(
    (p: Product) => p._id === productId,
  );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error || !product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add to favorites");
        return;
      }
      if (isFavorite) {
        await api.delete(`/api/favorites/${product._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await api.post(
          `/api/favorites/add`,
          { productId: product._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
      toast.success(isFavorite ? "Removed from favorites!" : "Added to favorites!");

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        //logged in user
        await api.post(
          "/api/cart/add-cart",
          {
            productId: product._id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        //guest user
        const guestToken = await getGuestSession();
        await api.post(
          "/api/cart/add-cart",
          {
            productId: product._id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${guestToken}`,
            },
          },
        );
      }
      toast.success("Added to cart!");

    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };
  return (
    <section className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
      {/* main product */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* product images */}
        <div className="flex gap-3">
          {/* images on the left */}
          {product.productImages.length > 1 && (
            <div className="flex flex-col gap-3">
              {product.productImages.map((img, i) => (
                <button
                  key={img._id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${selectedImage === i ? "border-black" : "border-transparent"}`}
                >
                  <Image
                    src={img.url}
                    alt={`${product.productName} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* big image */}
          <div className="relative flex-1 aspect-square rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={product.productImages[selectedImage]?.url}
              alt={product.productName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* the details of the product */}
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl md:text-3xl font-bold uppercase">
              {product.productName}
            </h1>
            <button onClick={handleFavorite} className="mt-1">
              {isFavorite ? (
                <PiHeartStraightFill size={24} className="text-red-500" />
              ) : (
                <PiHeartStraight size={24} />
              )}
            </button>
          </div>
          <StarRating rating={product.ratings} />

          <p className="text-2xl font-bold">
            ₦{product.productPrice.toLocaleString()}
          </p>

          <p className="text-gray-600 leading-7 border-b pb-5">
            {product.productDescription}
          </p>

          {/* colors */}
          <div>
            <p className="font-semibold mb-3">Select Colors</p>
            <div className="flex gap-3">
              {product.availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-4 ${selectedColor === color ? "border-black scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* sizes */}
          <div>
            <p className="font-semibold mb-3">Choose Sizes</p>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2  rounded-full border text-sm uppercase font-medium transition-colors ${selectedSize === size ? "border-black bg-black text-white" : "border-gray-300 hover:border-black"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* quantity */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-3 border rounded-full px-4 py-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-lg font-semibold"
              >
                -
              </button>
              <span className="text-center w-6">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-lg font-semibold"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex  items-center justify-center gap-2 bg-black text-white  py-3 font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              <SlHandbag size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
