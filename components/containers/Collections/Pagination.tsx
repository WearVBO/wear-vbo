"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}


export const CollectionsPagination = ({ page, totalPages, onPageChange} : PaginationProps) => {
    return (
           <Pagination>
      <PaginationContent>
        {/* Previous arrow */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="[&>span]:hidden cursor-pointer"
          />
        </PaginationItem>

        {/* First page */}
        <PaginationItem>
          <PaginationLink onClick={() => onPageChange(1)} isActive={page === 1} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>

        {/* Ellipsis if page > 3 */}
        {page > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Pages around current */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p !== 1 && p !== totalPages && Math.abs(p - page) <= 1)
          .map((p) => (
            <PaginationItem key={p}>
              <PaginationLink onClick={() => onPageChange(p)} isActive={page === p} className="cursor-pointer">
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

        {/* Ellipsis if page < totalPages - 2 */}
        {page < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last page */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageChange(totalPages)}
              isActive={page === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next arrow */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="[&>span]:hidden cursor-pointer"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    )
}