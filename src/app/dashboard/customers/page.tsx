// UTILS
import { api } from "@/trpc/server";
// TYPES
import type { CustomerType } from "@/lib/schema";
// CUSTOM COMPONENTS
import CustomerTable from "@/components/ui/data-table";
import CustomerSearchBox from "@/app/_components/url-search-box";
import CreateCustomerForm from "@/app/_components/create-customer-form";
// CONSTANTS
import { customerTableColumns } from "@/lib/data/data-table-column-defs";
import CustomerPagination from "@/app/_components/CustomerPagination";

type CustomerWithInvoiceDataType = CustomerType & {
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export default async function Customers({
  searchParams,
}: {
  // eslint-disable-next-line
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  const customerSearchQuery = searchParams?.query ?? "";
  const page = searchParams?.page ?? "1";
  const per_page = searchParams?.per_page ?? "5";

  const customers = await api.customer.getAll.query({
    query: customerSearchQuery,
    page: Number(page),
    per_page: Number(per_page),
  });

  return (
    <div className="flex flex-col gap-6">
      <h5 className="text-lg font-semibold md:text-3xl">Customers</h5>
      <div className="flex items-center gap-3 ">
        <CustomerSearchBox />
        <CreateCustomerForm />
      </div>
      <div>
        <CustomerTable
          columns={customerTableColumns}
          data={customers.customers as CustomerWithInvoiceDataType[]}
        />
      </div>
      <CustomerPagination
        hasPreviousPage={customers.hasPreviousPage}
        hasNextPage={customers.hasNextPage}
        total_page={customers.total_page}
      />
    </div>
  );
}
