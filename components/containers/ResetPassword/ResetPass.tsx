"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const ResetPass = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();
  const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams?.get("email") || "";
//   const code = searchParams?.get("code") || "";
  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: ResetPasswordFormData) => {
    // Handle reset password logic
    try {
        const email = localStorage.getItem("resetEmail");
        const code = localStorage.getItem("resetCode");
        const payload = {
            email,
            code,
            newPassword: data.password,
        }
      await api.post("/api/auth/reset-password", payload);
         localStorage.removeItem("resetEmail");
            localStorage.removeItem("resetCode");
      router.push("/login"); //this will redirect to login after resetting password successfully
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="font-bold text-3xl md:text-4xl">Set new password</h1>
      <p className="text-gray-700 mt-2 mb-6 text-center">
        Please enter your new password below and confirm it to reset your
        password.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col gap-5"
      >
        {/* new password */}
        <div className="px-5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className="w-full text-sm border border-black px-4 py-3"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
        </div>

        {/* to confirm password */}
        <div className="px-5">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative flex items-center">

          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match"
            })}
            className="w-full text-sm border border-black px-4 py-3"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
        </div>
        <button
          type="submit"
          className=" bg-black text-white py-3 px-4 border border-black rounded-sm hover:bg-gray-800 transition-colors mx-5 text-sm font-semibold uppercase tracking-widest"
        >
          Reset Password
        </button>
      </form>
    </section>
  );
};

export default ResetPass;
