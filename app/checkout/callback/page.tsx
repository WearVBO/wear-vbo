import { Suspense } from "react";
import { PaymentCallbackComponent } from "@/exports/exports";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          Verifying your payment...
        </div>
      }
    >
      <PaymentCallbackComponent />
    </Suspense>
  );
}
