import { LoginComponent } from "@/exports/exports";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginComponent />;
    </Suspense>
  );
}
