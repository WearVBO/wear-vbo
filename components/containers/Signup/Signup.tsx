"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";

type RegisterFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
};
const Signup = () => {
  const registerInput = [
    {
      label: "Full Name",
      name: "fullName" as const,
      type: "text",
      required: "Full name is required",
      hasEyeIcon: false,
    },
    {
      label: "Email",
      name: "email" as const,
      type: "email",
      required: "Email is required",
      hasEyeIcon: false,
      minLength: undefined,
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    {
      label: "Phone Number",
      name: "phoneNumber" as const,
      type: "tel",
      required: "Phone number is required",
      hasEyeIcon: false,
    },
    {
      label: "Password",
      name: "password" as const,
      type: "password",
      required: "Password is required",
      hasEyeIcon: true,
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/cart";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    const payload = {
      ...data,
      role: "USER", // this was hardcoded for users only sign up
    };
    try {
      const response = await api.post("/api/auth/register", payload);
      localStorage.setItem("token", response.data.data.token);
      router.push(redirectTo);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Registration failed:", error.message);
      } else {
        console.error("Registration failed:", error);
      }
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  // const togglePasswordVisibility = () => {
  //   setShowPassword((prev) => !prev);
  // };
  return (
    <section className="min-h-screen flex flex-col items-center gap-4 justify-center">
      <h1 className="font-bold text-3xl md:text-4xl">Signup</h1>
      <p className="text-gray-900 font-semibold mt-2 mb-4">
        Create your account
      </p>
      {/* <div className=""> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 w-full max-w-md"
      >
        {/* <div> */}
        {registerInput.map((input, index) => (
          <div key={index} className="px-5 ">
            <label className=" text-xs text-gray-500">{input.label}</label>
            <div className="flex items-center relative">
              <input
                {...register(input.name, { required: input.required, pattern: input.pattern, minLength: input.minLength })}
                type={
                  input.hasEyeIcon
                    ? showPassword
                      ? "text"
                      : "password"
                    : input.type
                }
                className="w-full text-sm border border-black px-4 py-3"
              />

              {input.hasEyeIcon && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              )}
            </div>
            {errors[input.name] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[input.name]?.message}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-black text-white text-sm font-semibold uppercase tracking-widest py-3 rounded-sm hover:bg-gray-800 transition-colors mx-5"
        >
          Signup
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-red-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
      {/* </div> */}
    </section>
  );
};

export default Signup;
