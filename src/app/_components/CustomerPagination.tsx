"use client";
// CUSTOM HOOKS
import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CustomerPagination({
  hasPreviousPage,
  hasNextPage,
  total_page,
}: {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  total_page: number;
}) {
  const searchParams = useSearchParams();
  console.log(total_page);
  const page = Number(searchParams.get("page") ?? "1");
  const per_page = Number(searchParams.get("per_page") ?? "5");

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

        {Array.from(Array(total_page).keys()).map((index) => (
          <PaginationItem key={index}>
            <PaginationLink href={`?page=${index + 1}&per_page=${per_page}`}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {hasNextPage && (
          <PaginationItem>
            <PaginationNext href={`?page=${page + 1}&per_page=${per_page}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
