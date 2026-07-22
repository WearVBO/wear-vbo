"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { AdminButton } from "@/components/admin/ui/AdminUI";
import { createAdmin, getCreateAdminError } from "@/services/adminAuth.service";
import type { AdminUser } from "@/lib/adminAuth";

type CreateAdminForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  adminSecret: string;
};

const fieldClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors";
const labelClass = "mb-1.5 block text-sm font-medium";

const CreateAdminModal = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (admin: AdminUser) => void;
}) => {
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminForm>();

  const onSubmit = async (values: CreateAdminForm) => {
    setFormError("");
    try {
      const response = await createAdmin({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
        adminSecret: values.adminSecret,
      });

      // The response carries a token for the NEW admin — discard it.
      // Swapping the session here would sign the current admin out.
      onCreated(response.data.admin);
      toast.success("Admin created successfully");
      onClose();
    } catch (err) {
      // A 403 means a bad secret, not a dead session — keep the admin
      // signed in and let them retype it.
      setFormError(getCreateAdminError(err));
      resetField("password");
      resetField("adminSecret");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-admin-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="create-admin-title" className="text-xl font-semibold">
              Create admin
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Requires your admin secret. This action is logged.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              autoComplete="off"
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
              })}
              className={fieldClass}
              placeholder="Jane Admin"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="adminEmail">
              Email
            </label>
            <input
              id="adminEmail"
              type="email"
              autoComplete="off"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={fieldClass}
              placeholder="new.admin@greenmart.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="phoneNumber">
              Phone number
            </label>
            <input
              id="phoneNumber"
              autoComplete="off"
              {...register("phoneNumber", {
                required: "Phone number is required",
                minLength: {
                  value: 11,
                  message: "Phone number must be 11–15 characters",
                },
                maxLength: {
                  value: 15,
                  message: "Phone number must be 11–15 characters",
                },
              })}
              className={fieldClass}
              placeholder="08012345678"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="adminPassword">
              Password
            </label>
            <input
              id="adminPassword"
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className={fieldClass}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-4">
            <label className={labelClass} htmlFor="adminSecret">
              Admin secret
            </label>
            <input
              id="adminSecret"
              type="password"
              autoComplete="off"
              {...register("adminSecret", {
                required: "Admin secret is required",
              })}
              className={fieldClass}
              placeholder="••••••••"
            />
            <p className="mt-2 text-xs text-gray-500">
              Typed by you each time. It is never saved to this device.
            </p>
            {errors.adminSecret && (
              <p className="mt-1 text-xs text-red-500">
                {errors.adminSecret.message}
              </p>
            )}
          </div>

          {formError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {formError}
            </p>
          )}

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AdminButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create admin"}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;
