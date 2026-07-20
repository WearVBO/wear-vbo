"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type ForgotPasswordFormData = {
  email: string;
};

const ForgotPass = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await api.post("/api/auth/forgot-password", { email: data.email });
      //pass email to the verify-otp page
      localStorage.setItem("resetEmail", data.email);
      router.push("/verify-otp");
    } catch (error) {
      // router.push(`/verify-otp`);
      console.error("Error sending password reset email:", error);
    }
  };
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="font-bold text-3xl md:text-4xl">Forgot Password?</h1>
      <p className="text-gray-700 mt-2 mb-6 text-center">
        Enter your email address below and we&apos;ll send you a reset code.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col gap-5"
      >
        <div className="px-5">
          <label className="text-xs text-gray-500">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            className="w-full text-sm border border-black px-4 py-3"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-black text-white text-sm font-semibold uppercase tracking-widest py-3 rounded-sm hover:bg-gray-800 transition-colors mx-5"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default ForgotPass;
