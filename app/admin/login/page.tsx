import { Suspense } from "react";
import AdminLogin from "@/components/admin/AdminLogin";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <AdminLogin />
    </Suspense>
  );
}
