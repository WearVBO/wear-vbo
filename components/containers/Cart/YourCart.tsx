"use client";
import React, {useState, useEffect, useMemo} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
// import { useCartStore } from "@/store/cartStore";
// import { CartItem } from "@/store/cartStore";
// import { useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import useSWR from "swr";
import api from "@/lib/axios";

interface CartProduct {
  _id: string;
  productName: string;
  productPrice: number;
  productImages: { url: string; publicId: string; _id: string }[];
  size: string;
  availableColors: string[];
}

interface CartItem {
  _id: string;
  productId: CartProduct;
  quantity: number;
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  const guestToken = localStorage.getItem("guestToken");
  const authToken = token || guestToken;

  const response = await api.get(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
};

// const dummyItems: CartItem[] = [
//   {
//     id: "1",
//     name: "Gradient Graphic T-shirt",
//     size: "Large",
//     color: "White",
//     price: 145,
//     quantity: 1,
//     image: "",
//   },
//   {
//     id: "2",
//     name: "Checkered Shirt",
//     size: "Medium",
//     color: "Red",
//     price: 180,
//     quantity: 1,
//     image: "",
//   },
//   {
//     id: "3",
//     name: "Skinny Fit Jeans",
//     size: "Large",
//     color: "Blue",
//     price: 240,
//     quantity: 1,
//     image: "",
//   },
// ];

const YourCart = () => {
  const pathname = usePathname();
  const router = useRouter();

   const { data, isLoading, error, mutate } = useSWR(
    "/api/cart/get-cart",
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const [quantities, setQuantities] = useState<{[key: string] : number}>(() => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem("cartQuantities");
    return saved ? JSON.parse(saved) : {};
  })

  const cartItems: CartItem[] = useMemo(() => data?.cart?.items || data?.cart || [], [data]);
  //sync
  useEffect(() => {
    if(cartItems.length > 0) {
      setQuantities(prev => {
        const updated = {...prev};
        cartItems.forEach(item => {
          if(!updated[item._id]) {
            updated[item._id] = item.quantity;
          }
        })
        localStorage.setItem("cartQuantities", JSON.stringify(updated));
        return updated;
      })
    }
    mutate();
  }, [cartItems, mutate])

  const increaseQuantity = (itemId: string) => {
    setQuantities(prev => {
      const updated = {...prev, [itemId]: (prev[itemId] || 1) + 1};
      localStorage.setItem("cartQuantities", JSON.stringify(updated))
      return updated;
    });
  };

    const decreaseQuantity = (itemId: string) => {
    setQuantities(prev => {
      const updated = {...prev, [itemId]: Math.max(1, (prev[itemId] || 1) - 1)};
      localStorage.setItem("cartQuantities", JSON.stringify(updated))
      return updated;
    });
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Cart", path: "/cart" },
  ];



  const handleRemoveItem = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      const guestToken = localStorage.getItem("guestToken");
      const authToken = token || guestToken;

      await api.delete(`/api/cart/delete-cart/${productId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      mutate(); // Re-fetch the cart data after deletion
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.productId.productPrice * (quantities[item._id] || 1), 
    0,
  );
  const discount = Math.round(subtotal * 0.2);
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  const summaryItems = [
    { label: "Subtotal", value: `$${subtotal}`, style: "text-black" },
    { label: "Discount (-20%)", value: `-$${discount}`, style: "text-red-500" },
    { label: "Delivery Fee", value: `$${deliveryFee}`, style: "text-black" },
  ];
  // const isHomePage = pathname === "/";

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load cart
      </div>
    );
  return (
    <section className="px-4 md:px-10 pt-4 pb-10 md:pt-10">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 ">
        {links.map((link, index) => {
          const isActive = pathname === link.path;
          return (
            <React.Fragment key={index}>
              <Link
                href={link.path}
                className={`${isActive ? "text-black font-semibold" : "text-gray-400"}`}
              >
                {link.name}
              </Link>
              {index < links.length - 1 && (
                <IoIosArrowForward className="text-gray-400" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* main cart */}

      <h1 className="font-bold uppercase text-3xl mt-4 md:mt-2">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* cart Items */}
        <div className="md:col-span-2 flex flex-col gap-4 border rounded-xl mt-4">
          {cartItems.map((item, index) => (
            <React.Fragment key={item._id}>
              <div className="flex items-center gap-4  p-4">
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden relative ">
                  {item.productId.productImages[0].url ? (
                    <Image
                      src={item.productId.productImages[0]?.url || ""}
                      alt={item.productId.productName}
                      fill
                      className="object-cover "
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 animate-pulse" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <p className="font-semibold">{item.productId.productName}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.productId.size}
                  </p>
                  <p className="text-sm text-gray-500">
                    Color: {item.productId.availableColors}
                  </p>
                  <p className="font-bold mt-1">
                    ${(item.productId.productPrice * (quantities[item._id] || 1)).toFixed(2)}
                  </p>
                </div>
                {/* Quantity */}
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    <button onClick={() => handleRemoveItem(item.productId._id)}>
                      <RiDeleteBin5Line className="text-red-500 text-lg" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 border rounded-full px-3 py-1">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="text-lg"
                    >
                      −
                    </button>
                    <span>{quantities[item._id] || 1}</span>
                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              {index < cartItems.length - 1 && <hr className="mx-4" />}
            </React.Fragment>
          ))}
        </div>

        {/* summary */}
        <div className="border rounded-xl p-6 h-fit flex flex-col gap-4">
          <h2 className="text-xl font-bold">Order Summary</h2>
          {summaryItems.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between text-sm ${item.style}`}
            >
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}

          <hr />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors text-center block"
          >
            Go to Checkout
          </button>
        </div>
      </div>
    </section>
  );
};

export default YourCart;
