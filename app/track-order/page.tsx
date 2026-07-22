import { Suspense } from "react";
import { TrackOrderComponent } from "@/exports/exports";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <TrackOrderComponent />
    </Suspense>
  );
}
