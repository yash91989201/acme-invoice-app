import { Suspense } from "react";
// CUSTOM COMPONENTS
import InvoiceTable, {
  InvoiceTableSkeleton,
} from "@/app/_components/invoice-table";
import InvoiceSearchBox from "@/app/_components/url-search-box";
import CreateInvoice, {
  CreateInvoiceSkeleton,
} from "@/app/_components/create-invoice";

export default async function Invoices({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  return (
    <div className="flex flex-col gap-6">
      <h5 className="text-lg font-semibold md:text-3xl">Invoices</h5>
      <div className="flex flex-col  gap-3 sm:flex-row sm:items-center ">
        <InvoiceSearchBox />
        <Suspense fallback={<CreateInvoiceSkeleton />}>
          <CreateInvoice />
        </Suspense>
      </div>
      <Suspense fallback={<InvoiceTableSkeleton />}>
        <InvoiceTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
