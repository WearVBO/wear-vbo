"use client";
import React, {useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
// import { useSearchParams } from "next/navigation";
// 
type VerifyOtpFormData = {
  // email: string;
  otp: string;
};

const VerifyOtp = () => {
  const router = useRouter();
  // const searchParms = useSearchParams();
  // const email = localStorage.getItem("resetEmail") || "";
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("resetEmail") || "")
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>();

  const onSubmit = async (data: VerifyOtpFormData) => {
    try {
      const email = localStorage.getItem("resetEmail");
      const payload = {
        email,
        code: data.otp,
      }
      await api.post("/api/auth/verify-otp", payload);
      localStorage.setItem("resetCode", data.otp)
      router.push(`/reset-password`);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="font-bold text-3xl md:text-4xl">Forgot Password?</h1>
      <p className="text-gray-700 mt-2 mb-6 text-center">
        Enter the code sent to{" "}
        <span className="font-semibold text-black">{email}</span>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col gap-5"
      >
        <div className="px-5">
          <label className="text-xs text-gray-500">Verify OTP</label>
          <input
            {...register("otp", { required: "OTP is required" })}
            type="text"
            className="w-full text-sm border border-black px-4 py-3"
          />
          {errors.otp && (
            <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
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

export default VerifyOtp;
