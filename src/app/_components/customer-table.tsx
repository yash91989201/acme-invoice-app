import { redirect } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
// SCHEMAS
import { customerTableColumns } from "@/lib/data/data-table-column-defs";
// TYPES
import type { CustomerWithInvoiceDataType } from "@/lib/schema";
// CUSTOM COMPONENTS
import DataTable from "@/components/ui/data-table";
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

function CustomerTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-gray-100">
      <div className=" rounded-md bg-white ">
        <div className="flex items-center justify-around border-b border-gray-200 bg-white p-3 text-sm font-semibold text-gray-700">
          <p>Name</p>
          <p>Email</p>
          <p>Total Invoices</p>
          <p>Total Paid</p>
          <p>Actions</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-white p-3">
        <div className="h-14 w-full animate-pulse rounded-md  bg-gray-100"></div>
        <div className="h-14 w-full animate-pulse rounded-md  bg-gray-100"></div>
        <div className="h-14 w-full animate-pulse rounded-md  bg-gray-100"></div>
        <div className="h-14 w-full animate-pulse rounded-md  bg-gray-100"></div>
        <div className="h-14 w-full animate-pulse rounded-md  bg-gray-100"></div>
      </div>
    </div>
  );
}

export { CustomerTableSkeleton };
