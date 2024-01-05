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
    <Pagination>
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${page - 1}&per_page=${per_page}`}
            />
          </PaginationItem>
        )}

        {paginatedItems.map((item, index) => {
          if (item === "...")
            return (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            );
          return (
            <PaginationItem key={index}>
              <PaginationLink
                href={`?page=${index + 1}&per_page=${per_page}`}
                className={cn(
                  "bg-white",
                  index + 1 === page && "bg-primary text-white",
                )}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {hasNextPage && (
          <PaginationItem>
            <PaginationNext href={`?page=${page + 1}&per_page=${per_page}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
