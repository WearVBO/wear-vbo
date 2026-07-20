import { Suspense } from "react";
import { CollectionsPage } from "@/exports/exports";

export default function page() {
  return (
    <Suspense fallback="Loading...">
      <CollectionsPage />
    </Suspense>
  );
}