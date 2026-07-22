"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import { getApiErrorMessage } from "@/lib/apiClient";
import { getPaymentStatus, verifyPayment } from "@/services/payment.service";
import {
  clearCheckoutReference,
  getCheckoutReference,
} from "@/services/checkout.service";
import { CART_KEY } from "@/hooks/useCart";
import type { PaymentStatus } from "@/lib/types";

type Screen = "verifying" | "success" | "pending" | "failed";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 30000;

const PaymentCallback = () => {
  const searchParams = useSearchParams();
  const { mutate } = useSWRConfig();

  const [screen, setScreen] = useState<Screen>("verifying");
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [reason, setReason] = useState("");
  const hasRun = useRef(false);

  const finishSuccess = useCallback(
    (order: string, status: PaymentStatus) => {
      setOrderNumber(order);
      setPaymentStatus(status);
      setScreen("success");
      clearCheckoutReference();
      // the server already emptied the cart; refresh local state
      mutate(CART_KEY);
    },
    [mutate],
  );

  useEffect(() => {
    // Flutterwave can redirect twice; only verify once.
    if (hasRun.current) return;
    hasRun.current = true;

    const txRef = searchParams?.get("tx_ref") || getCheckoutReference();
    const transactionId = searchParams?.get("transaction_id") || "";
    const status = searchParams?.get("status") || "";

    if (!txRef) {
      setScreen("failed");
      setReason("We could not find your payment reference.");
      return;
    }

    let cancelled = false;

    /**
     * The redirect's `status` param is never trusted — only the verify
     * endpoint (and, failing that, the polled status) decides the outcome.
     */
    const pollUntilSettled = async () => {
      const deadline = Date.now() + POLL_TIMEOUT_MS;

      while (!cancelled && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        if (cancelled) return;

        try {
          const response = await getPaymentStatus(txRef);
          const settled = response.data?.paymentStatus;

          if (settled === "paid") {
            finishSuccess(response.data.order?.orderNumber || "", settled);
            return;
          }
          if (settled && settled !== "pending") {
            setOrderNumber(response.data.order?.orderNumber || "");
            setPaymentStatus(settled);
            setScreen("failed");
            setReason(`Payment ${settled}.`);
            return;
          }
        } catch {
          // keep polling — the webhook may still be in flight
        }
      }

      if (!cancelled) setScreen("pending");
    };

    const run = async () => {
      try {
        const response = await verifyPayment({
          tx_ref: txRef,
          transaction_id: transactionId,
          status,
        });

        // failures also come back as HTTP 200 — check `success`, not the code
        if (response.success) {
          finishSuccess(
            response.data?.orderNumber || "",
            response.data?.paymentStatus || "paid",
          );
          return;
        }

        setOrderNumber(response.data?.orderNumber || "");
        setReason(
          response.data?.reason || response.message || "Payment was not completed.",
        );

        if (response.data?.paymentStatus === "pending") {
          await pollUntilSettled();
        } else {
          setScreen("failed");
        }
      } catch (err) {
        setReason(getApiErrorMessage(err, "We could not verify your payment."));
        setScreen("failed");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [searchParams, finishSuccess]);

  if (screen === "verifying")
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        <p className="text-gray-600">Verifying your payment...</p>
        <p className="text-sm text-gray-400">Please don&apos;t close this page.</p>
      </div>
    );

  if (screen === "success")
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold">Payment successful</h1>
        <p className="text-gray-600">
          Thank you! Your order{" "}
          <span className="font-semibold">{orderNumber}</span> is confirmed.
        </p>
        {paymentStatus && (
          <p className="text-sm text-gray-500">Payment status: {paymentStatus}</p>
        )}
        <div className="flex gap-3 mt-2">
          <Link
            href={`/track-order?orderNumber=${encodeURIComponent(orderNumber)}`}
            className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
          >
            Track order
          </Link>
          <Link
            href="/collections"
            className="border border-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );

  if (screen === "pending")
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Payment still processing</h1>
        <p className="text-gray-600 max-w-md">
          We haven&apos;t received final confirmation yet. If your account was
          debited, your order will be confirmed shortly.
        </p>
        {orderNumber && (
          <p className="text-sm text-gray-500">Order {orderNumber}</p>
        )}
        <Link
          href="/track-order"
          className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
        >
          Track order
        </Link>
      </div>
    );

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl">
        !
      </div>
      <h1 className="text-2xl font-bold">Payment not completed</h1>
      <p className="text-gray-600 max-w-md">{reason}</p>
      {orderNumber && (
        <p className="text-sm text-gray-500">Order {orderNumber}</p>
      )}
      <div className="flex gap-3 mt-2">
        <Link
          href="/checkout"
          className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
        >
          Retry payment
        </Link>
        <Link
          href="/cart"
          className="border border-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
};

export default PaymentCallback;
