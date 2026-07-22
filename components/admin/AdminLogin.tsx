"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { AdminButton } from "@/components/admin/ui/AdminUI";
import { getAdminToken, setAdminSession } from "@/lib/adminAuth";
import { adminLogin, getAdminLoginError } from "@/services/adminAuth.service";

type LoginForm = {
  email: string;
  password: string;
};

const fieldClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors";

const AdminLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const expired = searchParams?.get("expired") === "1";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  // an admin who is already signed in never sees this page
  useEffect(() => {
    if (getAdminToken()) router.replace("/admin/management");
  }, [router]);

  const onSubmit = async (values: LoginForm) => {
    setFormError("");
    try {
      const response = await adminLogin(values.email.trim(), values.password);
      setAdminSession(response.data.token, response.data.admin);
      router.replace("/admin/management");
    } catch (err) {
      setFormError(getAdminLoginError(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/Image/new-black.png"
            alt="WearVbo"
            width={80}
            height={50}
            className="w-[70px]"
          />
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Admin sign in
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Restricted access. Authorised staff only.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          {expired && (
            <p className="mb-4 rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">
              Session expired, please log in again.
            </p>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={fieldClass}
                placeholder="admin@greenmart.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`${fieldClass} pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {formError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </p>
            )}

            <AdminButton
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </AdminButton>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Admin accounts are provisioned internally.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
