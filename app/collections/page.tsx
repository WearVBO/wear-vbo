import { Suspense } from "react";
import { CollectionsPage } from "@/exports/exports";
import { ProductGridSkeleton } from "@/components/containers/skeletons";

export default function page() {
  return (
    <Suspense
      fallback={
        <section className="px-4 md:px-10 py-8">
          <ProductGridSkeleton count={9} />
        </section>
      }
    >
      <CollectionsPage />
    </Suspense>
  );
}
