"use client";
import React, { useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import {useRouter} from "next/navigation"
import Image from "next/image";
import { PiHeartStraightFill, PiHeartStraight } from "react-icons/pi";
import { SlHandbag } from "react-icons/sl";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiClient";
import { getSingleProduct } from "@/services/product.service";
import { addToCart } from "@/services/cart.service";
import { CART_KEY } from "@/hooks/useCart";
import { ProductDetailSkeleton } from "@/components/containers/skeletons";
import type { ProductVariant } from "@/lib/types";

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
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { mutate } = useSWRConfig();

  const router = useRouter();

  const { data, isLoading, error } = useSWR(
    productId ? `/api/product/get-single-product/${productId}` : null,
    () => getSingleProduct(productId),
  );

  const product = data?.data?.product;
  const variants = useMemo(() => data?.data?.variants ?? [], [data]);
  const related = useMemo(() => data?.data?.related ?? [], [data]);
  const baseStock = data?.data?.stock ?? 0;

  const selectedVariant: ProductVariant | undefined = variants.find(
    (variant) => variant._id === selectedVariantId,
  );

  // With variants, price and stock come from the chosen variant.
  const availableStock = variants.length
    ? (selectedVariant?.stock ?? 0)
    : baseStock;
  const displayPrice = selectedVariant?.price ?? product?.productPrice ?? 0;
  const needsVariant = variants.length > 0 && !selectedVariant;
  const isOutOfStock = !needsVariant && availableStock <= 0;

  if (isLoading) return <ProductDetailSkeleton />;
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
        toast.error("Please log in to save favorites");
        setTimeout(() => {
          const currentPath = window.location.pathname;
          router.push(`/login?redirect=${currentPath}`)
        }, 1500)

        return;
      }
      if (isFavorite) {
        await api.delete(`/api/favorites/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(
          `/api/favorites/add`,
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      toast.success(
        isFavorite ? "Removed from favorites!" : "Added to favorites!",
      );
      setIsFavorite(!isFavorite);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update favorites."));
    }
  };

  const handleAddToCart = async () => {
    if (needsVariant) {
      toast.error("Please choose an option first");
      return;
    }
    setIsAdding(true);
    try {
      await addToCart(product._id, quantity, selectedVariantId);
      mutate(CART_KEY);
      toast.success("Added to cart!");
    } catch (err) {
      // includes the 409 "Only N unit(s) available" response
      toast.error(getApiErrorMessage(err, "Failed to add to cart."));
    } finally {
      setIsAdding(false);
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
            {product.productImages[selectedImage]?.url && (
              <Image
                src={product.productImages[selectedImage].url}
                alt={product.productName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
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

          <p className="text-2xl font-bold">₦{displayPrice.toLocaleString()}</p>

          {product.category && (
            <p className="text-sm text-gray-500">
              Category: {product.category.name}
            </p>
          )}

          <p className="text-gray-600 leading-7 border-b pb-5">
            {product.productDescription}
          </p>

          {/* variant picker */}
          {variants.length > 0 ? (
            <div>
              <p className="font-semibold mb-3">Choose an option</p>
              <div className="flex gap-3 flex-wrap">
                {variants.map((variant) => {
                  const soldOut = variant.stock <= 0 || !variant.isActive;
                  const isSelected = selectedVariantId === variant._id;
                  return (
                    <button
                      key={variant._id}
                      disabled={soldOut}
                      onClick={() => {
                        setSelectedVariantId(variant._id);
                        setQuantity(1);
                      }}
                      className={`px-5 py-2 rounded-full border text-sm uppercase font-medium transition-colors ${
                        soldOut
                          ? "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                          : isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {[variant.size, variant.color]
                        .filter(Boolean)
                        .join(" / ")}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* colors */}
              {product.availableColors?.length > 0 && (
                <div>
                  <p className="font-semibold mb-3">Colors</p>
                  <div className="flex gap-3">
                    {product.availableColors.map((color) => (
                      <span
                        key={color}
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* sizes */}
              {product.sizes?.length > 0 && (
                <div>
                  <p className="font-semibold mb-3">Sizes</p>
                  <div className="flex gap-3 flex-wrap">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-5 py-2 rounded-full border border-gray-300 text-sm uppercase font-medium"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* stock */}
          {isOutOfStock ? (
            <p className="text-sm font-semibold text-red-500">Out of stock</p>
          ) : (
            !needsVariant &&
            availableStock <= 5 && (
              <p className="text-sm text-orange-500">
                Only {availableStock} left in stock
              </p>
            )
          )}

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
                onClick={() =>
                  setQuantity(Math.min(availableStock || 1, quantity + 1))
                }
                className="text-lg font-semibold"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 font-semibold rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <SlHandbag size={20} />{" "}
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <Link
                key={item._id}
                href={`/collections/product/${item._id}`}
                className="flex flex-col gap-3"
              >
                <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  {item.productImages?.[0]?.url && (
                    <Image
                      src={item.productImages[0].url}
                      alt={item.productName}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="font-bold">
                  ₦{item.productPrice.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetail;
