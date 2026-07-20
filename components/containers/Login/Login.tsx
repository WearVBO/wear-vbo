"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter , useSearchParams} from "next/navigation";
import api from "@/lib/axios";
// import { getGuestSession } from "@/lib/guestSession";

type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const labelInput = [
    {
      label: "Email",
      name: "email" as const,
      type: "email",
      required: "Email is required",
      minLength: undefined,
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
      hasEyeIcon: false,
    },
    {
      label: "Password",
      name: "password" as const,
      type: "password",
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
      hasEyeIcon: true,
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/cart";

  const onSubmit = async (data: LoginFormData) => {
    const guestToken = localStorage.getItem("guestToken");

    const payload = {
      email: data.email,
      password: data.password,
      ...(guestToken && {guestToken}),
    }
    try {
      const response = await api.post("/api/auth/login", payload);

      // save user token to localStorage
      localStorage.setItem("token", response.data.data.token);
      localStorage.removeItem("guestToken"); // remove guest token after successful login
      router.push(redirectTo);
      console.log("Login successful:", response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center gap-4 justify-center">
      <h1 className="font-bold text-3xl md:text-4xl">Login</h1>
      <p className="text-gray-900 font-semibold mt-2 mb-4">Hi, Welcome back</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 w-full max-w-md"
      >
        {labelInput.map((input, index) => (
          <div key={index} className="px-5">
            <label className="text-xs text-gray-500">{input.label}</label>
            <div className="flex items-center relative">
              <input
                {...register(input.name, {
                  required: input.required,
                  minLength: input.minLength,
                  pattern: input.pattern,
                })}
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

        {/* remember me */}
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label
              htmlFor="remember"
              className="text-sm text-gray-700 font-bold"
            >
              Remember me
            </label>
          </div>
          <Link href="/forgot-password"
            type="button"
            className="text-sm text-red-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="bg-black text-white text-sm font-semibold uppercase tracking-widest py-3 rounded-sm hover:bg-gray-800 transition-colors mx-5"
        >
          Login
        </button>

        <p className="text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-red-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
