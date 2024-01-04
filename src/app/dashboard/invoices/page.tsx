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

export default async function Invoices({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const invoiceSearchQuery = searchParams?.query ?? "";

  const customers = await api.customer.getAll.query({});
  const invoices = await api.invoice.getAll.query({
    query: invoiceSearchQuery,
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
          data={invoices as InvoiceTableColumnType[]}
        />
      </div>
    </div>
  );
}
