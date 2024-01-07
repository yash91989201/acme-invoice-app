import { redirect } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
// TYPES
import type { InvoiceWithCustomerType as InvoiceTableColumnType } from "@/lib/schema";
// CUSTOM COMPONENTS
import InvoiceTable from "@/components/ui/data-table";
import InvoiceSearchBox from "@/app/_components/url-search-box";
import RowsPerPage from "@/components/dashboard/rows-per-page";
import PaginationWtihEllepsis from "@/components/dashboard/pagination-with-ellepsis";
// CONSTANTS
import { invoiceTableColumns } from "@/lib/data/data-table-column-defs";
import CreateInvoiceForm from "@/app/_components/create-invoice.form";

export default async function Invoices({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string; per_page?: string };
}) {
  const invoiceSearchQuery = searchParams?.query ?? "";
  const page = Number(searchParams?.page ?? "1");
  const per_page = Number(searchParams?.per_page ?? "5");

  const customers = await api.customer.getAll.query({});
  const invoices = await api.invoice.getAll.query({
    query: invoiceSearchQuery,
    page: Number(page),
    per_page: Number(per_page),
  });

  if (page > invoices.total_page && invoices.invoices.length !== 0)
    redirect(`?page=${invoices.total_page}&per_page=${per_page}`);

  return (
    <div className="flex flex-col gap-6">
      <h5 className="text-lg font-semibold md:text-3xl">Invoices</h5>
      <div className="flex flex-col  gap-3 sm:flex-row sm:items-center ">
        <InvoiceSearchBox />
        <CreateInvoiceForm customers={customers.customers} />
      </div>
      <div>
        <InvoiceTable
          columns={invoiceTableColumns}
          data={invoices.invoices as InvoiceTableColumnType[]}
        />
      </div>
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
    </div>
  );
}
