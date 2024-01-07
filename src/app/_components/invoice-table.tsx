import { redirect } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
// SCHEMAS
import { invoiceTableColumns } from "@/lib/data/data-table-column-defs";
// TYPES
import type { InvoiceTableColumnType } from "@/lib/schema";
// CUSTOM COMPONENTS
import DataTable from "@/components/ui/data-table";
import RowsPerPage from "@/components/dashboard/rows-per-page";
import PaginationWtihEllepsis from "@/components/dashboard/pagination-with-ellepsis";

export default async function InvoiceTable({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  const invoiceSearchQuery = searchParams?.query ?? "";
  const page = Number(searchParams?.page ?? "1");
  const per_page = Number(searchParams?.per_page ?? "5");

  const invoices = await api.invoice.getAll.query({
    query: invoiceSearchQuery,
    page: Number(page),
    per_page: Number(per_page),
  });

  if (page > invoices.total_page && invoices.invoices.length !== 0)
    redirect(`?page=${invoices.total_page}&per_page=${per_page}`);

  return (
    <>
      <DataTable
        columns={invoiceTableColumns}
        data={invoices.invoices as InvoiceTableColumnType[]}
      />
      <div className="flex flex-col-reverse items-center gap-6 empty:hidden lg:flex-row lg:justify-end lg:gap-12">
        {invoices.invoices.length !== 0 && <RowsPerPage per_page={per_page} />}
        {invoices.total_page > 1 && (
          <PaginationWtihEllepsis
            hasPreviousPage={invoices.hasPreviousPage}
            hasNextPage={invoices.hasNextPage}
            total_page={invoices.total_page}
          />
        )}
      </div>
    </>
  );
}

function InvoiceTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-gray-100">
      <div className=" rounded-md bg-white ">
        <div className="flex items-center justify-around border-b border-gray-200 bg-white p-3 text-sm font-semibold text-gray-700">
          <p>Name</p>
          <p>Email</p>
          <p>Amount</p>
          <p>Date</p>
          <p>Status</p>
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

export { InvoiceTableSkeleton };
