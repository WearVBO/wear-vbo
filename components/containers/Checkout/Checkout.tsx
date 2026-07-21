"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { useForm } from "react-hook-form";
import OrderSummary from "./OrderSummary";
// import { useCartStore } from "@/store/cartStore";

type CheckoutFormData = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  phone: string;
};

const Checkout = () => {
//   const { items } = useCartStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();
  const pathname = usePathname();
  const links = [
    { name: "Home", link: "/" },
    { name: "Cart", link: "/cart" },
    { name: "Checkout", link: "/checkout" },
  ];

  const contactFields = [
    {
      label: "Email",
      name: "email" as const,
      type: "email",
      required: "Email is required",
      colSpan: "col-span-2",
    },
  ];

  const deliveryFields = [
    {
      label: "First Name",
      name: "firstName" as const,
      type: "text",
      required: "First name is required",
      colSpan: "col-span-1",
    },
    {
      label: "Last Name",
      name: "lastName" as const,
      type: "text",
      required: "Last name is required",
      colSpan: "col-span-1",
    },
    {
      label: "Address",
      name: "address" as const,
      type: "text",
      required: "Address is required",
      colSpan: "col-span-2",
    },
    {
      label: "City",
      name: "city" as const,
      type: "text",
      required: "City is required",
      colSpan: "col-span-1",
    },
    {
      label: "State",
      name: "state" as const,
      type: "text",
      required: "State is required",
      colSpan: "col-span-1",
    },
    {
      label: "Phone",
      name: "phone" as const,
      type: "text",
      required: "Phone is required",
      colSpan: "col-span-2",
    },
  ];

  const onSubmit = async (data: CheckoutFormData) => {
   // send the data to the  payment gateway
    console.log("Checkout Data:", data);
  };
  return (
    <section className="px-4 md:px-10 py-6">
      {/*  breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        {links.map((link, index) => {
          const isActive = pathname === link.link;
          return (
            <React.Fragment key={index}>
              <Link
                href={link.link}
                className={
                  isActive ? "text-black font-semibold" : "text-gray-500"
                }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* left delivery */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* contact fields   */}
          <div>
            <h2 className="font-bold uppercase trcaking-widest text-sm mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {contactFields.map((field, index) => (
                <div key={index} className={field.colSpan}>
                  <input
                    {...register(field.name, { required: field.required })}
                    type={field.type}
                    placeholder={field.label}
                    className="w-full border boder-gray-300 rounded-md px-4 py-3 text-sm "
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* delivery */}
          <div>
            <h2 className="font-bold uppercase tracking-widest text-sm mb-4">
              Delivery Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {deliveryFields.map((field, index) => (
                <div key={index} className={field.colSpan}>
                  <input
                    {...register(field.name, { required: field.required })}
                    type={field.type}
                    placeholder={field.label}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* place order */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            Place Order
          </button>

        </form>
          {/* order summary */}
          <div className=" h-fit flex flex-col gap-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <OrderSummary />
          </div>
      </div>
    </section>
  );
};

export default Checkout;
