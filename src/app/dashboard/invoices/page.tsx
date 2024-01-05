// UTILS
import { api } from "@/trpc/server";
// TYPES
import type { InvoiceTableColumnType } from "@/lib/data/data-table-column-defs";
// CUSTOM COMPONENTS
import InvoiceTable from "@/components/ui/data-table";
import InvoiceSearchBox from "@/app/_components/url-search-box";
// CONSTANTS
import { invoiceTableColumns } from "@/lib/data/data-table-column-defs";
import CreateInvoiceForm from "@/app/_components/create-invoice.form";
import PaginationWtihEllepsis from "@/components/dashboard/PaginationWithEllepsis";

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

  return (
    <div className="flex flex-col gap-6">
      <h5 className="text-lg font-semibold md:text-3xl">Invoices</h5>
      <div className="flex items-center gap-3 ">
        <InvoiceSearchBox />
        <CreateInvoiceForm customers={customers.customers} />
      </div>
      <div>
        <InvoiceTable
          columns={invoiceTableColumns}
          data={invoices.invoices as InvoiceTableColumnType[]}
        />
      </div>
      {invoices.invoices.length > per_page && (
        <PaginationWtihEllepsis
          hasPreviousPage={invoices.hasPreviousPage}
          hasNextPage={invoices.hasNextPage}
          total_page={invoices.total_page}
        />
      )}
    </div>
  );
}
