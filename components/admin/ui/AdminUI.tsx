"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { TableRowsSkeleton } from "@/components/containers/skeletons";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

/* --------------------------------- surfaces -------------------------------- */

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "rounded-2xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
      className,
    )}
  >
    {children}
  </div>
);

export const PageHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

/* ---------------------------------- badges --------------------------------- */

const ORDER_TONES: Record<OrderStatus, string> = {
  pending: "bg-gray-100 text-gray-600",
  confirmed: "bg-brand-soft text-brand-dark",
  processing: "bg-brand-soft text-brand-dark",
  shipped: "bg-blue-50 text-blue-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

const PAYMENT_TONES: Record<PaymentStatus, string> = {
  pending: "bg-gray-100 text-gray-600",
  paid: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-600",
  cancelled: "bg-red-50 text-red-600",
  refunded: "bg-brand-soft text-brand-dark",
};

export const StatusBadge = ({
  status,
  kind = "order",
}: {
  status?: string;
  kind?: "order" | "payment" | "neutral";
}) => {
  const tone =
    kind === "order"
      ? ORDER_TONES[status as OrderStatus]
      : kind === "payment"
        ? PAYMENT_TONES[status as PaymentStatus]
        : undefined;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize whitespace-nowrap",
        tone || "bg-gray-100 text-gray-600",
      )}
    >
      {status || "—"}
    </span>
  );
};

/* --------------------------------- buttons --------------------------------- */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger";
};

export const AdminButton = ({
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    outline: "border border-gray-300 text-black hover:border-black",
    ghost: "text-gray-600 hover:bg-gray-100",
    danger: "border border-red-200 text-red-600 hover:bg-red-50",
  };
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
    />
  );
};

/* ---------------------------------- states --------------------------------- */

export const LoadingRows = ({ rows = 5 }: { rows?: number }) => (
  <TableRowsSkeleton rows={rows} />
);

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
    <p className="font-semibold">{title}</p>
    {description && (
      <p className="text-sm text-gray-500 max-w-sm">{description}</p>
    )}
    {action}
  </div>
);

export const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
    <p className="font-semibold text-red-600">Something went wrong</p>
    <p className="text-sm text-gray-500 max-w-sm">{message}</p>
    {onRetry && (
      <AdminButton variant="outline" onClick={onRetry}>
        Try again
      </AdminButton>
    )}
  </div>
);

/* -------------------------------- pagination ------------------------------- */

export const AdminPagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const windowSize = 5;
  const start = Math.max(1, Math.min(page - 2, totalPages - windowSize + 1));
  const pages = Array.from(
    { length: Math.min(windowSize, totalPages) },
    (_, i) => start + i,
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 md:px-6 py-4 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="h-9 w-9 rounded-full border border-gray-200 text-sm disabled:opacity-40 hover:border-black transition-colors"
        >
          ‹
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "h-9 w-9 rounded-full text-sm transition-colors",
              p === page
                ? "bg-black text-white"
                : "border border-gray-200 hover:border-black",
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="h-9 w-9 rounded-full border border-gray-200 text-sm disabled:opacity-40 hover:border-black transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
};

/* --------------------------------- helpers --------------------------------- */

export const formatMoney = (value: number, currency = "₦") =>
  `${currency}${(value ?? 0).toLocaleString()}`;

export const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
