// UTILS
import { api } from "@/trpc/server";
// TYPES
import type { CustomerTableColumnType } from "@/lib/data/data-table-column-defs";
// CUSTOM COMPONENTS
import CustomerTable from "@/components/ui/data-table";
import CustomerSearchBox from "@/app/_components/url-search-box";
import CreateCustomerForm from "@/app/_components/create-customer-form";
// CONSTANTS
import { customerTableColumns } from "@/lib/data/data-table-column-defs";

export default async function Customers({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const customerSearchQuery = searchParams?.query ?? "";

  const customers = await api.customer.getAll.query({
    query: customerSearchQuery,
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
          data={customers as CustomerTableColumnType[]}
        />
      </div>
    </div>
  );
}
