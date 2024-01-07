import { api } from "@/trpc/server";
import { invoiceTableColumns } from "@/lib/data/data-table-column-defs";
import type { InvoiceTableColumnType } from "@/lib/schema";

import DataTable from "@/components/ui/data-table";
import RowsPerPage from "@/components/dashboard/rows-per-page";
import PaginationWtihEllepsis from "@/components/dashboard/pagination-with-ellepsis";
import { redirect } from "next/navigation";

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
