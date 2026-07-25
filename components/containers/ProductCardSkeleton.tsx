import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <Skeleton className="w-3/4 h-4 rounded" />
      <Skeleton className="w-1/2 h-4 rounded" />
    </div>
  );
};

export default ProductCardSkeleton;