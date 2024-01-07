import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import DataTable from "@/components/ui/data-table";
import { customerTableColumns } from "@/lib/data/data-table-column-defs";
import type { CustomerWithInvoiceDataType } from "@/lib/schema";
import RowsPerPage from "@/components/dashboard/rows-per-page";
import PaginationWtihEllepsis from "@/components/dashboard/pagination-with-ellepsis";

export default async function CustomerTable({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  const customerSearchQuery = searchParams?.query ?? "";
  const page = Number(searchParams?.page ?? "1");
  const per_page = Number(searchParams?.per_page ?? "5");

  const { customers, hasNextPage, hasPreviousPage, total_page } =
    await api.customer.getAll.query({
      query: customerSearchQuery,
      page: Number(page),
      per_page: Number(per_page),
    });

  if (page > total_page && customers.length !== 0)
    redirect(`?page=${total_page}&per_page=${per_page}`);

  return (
    <>
      <DataTable
        columns={customerTableColumns}
        data={customers as CustomerWithInvoiceDataType[]}
      />

      <div className="flex flex-col-reverse items-center gap-6 lg:flex-row lg:justify-end lg:gap-12 ">
        {customers.length !== 0 && <RowsPerPage per_page={per_page} />}
        {total_page > 1 && (
          <PaginationWtihEllepsis
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            total_page={total_page}
          />
        )}
      </div>
    </>
  );
}
