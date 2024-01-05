"use client";
// CUSTOM HOOKS
import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn, paginationWithEllepsis } from "@/lib/utils";

export default function PaginationWtihEllepsis({
  hasPreviousPage,
  hasNextPage,
  total_page,
}: {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  total_page: number;
}) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const per_page = Number(searchParams.get("per_page") ?? "5");

  const paginatedItems = paginationWithEllepsis({
    current: page,
    max: total_page,
  }).items;

  return (
    <Pagination className="mx-0 w-fit">
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationPrevious href={`?page=${page - 1}&per_page=${per_page}`} />
        )}

        {paginatedItems.map((item, index) => {
          if (item === "...")
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );

          return (
            <PaginationLink
              key={index}
              href={`?page=${index + 1}&per_page=${per_page}`}
              className={cn(
                "bg-white",
                index + 1 === page && "bg-primary text-white",
              )}
            >
              {index + 1}
            </PaginationLink>
          );
        })}

        {hasNextPage && (
          <PaginationNext href={`?page=${page + 1}&per_page=${per_page}`} />
        )}
      </PaginationContent>
    </Pagination>
  );
}
