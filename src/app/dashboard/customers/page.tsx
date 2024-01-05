import { redirect } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
// TYPES
import type { CustomerWithInvoiceDataType } from "@/lib/schema";
// CUSTOM COMPONENTS
import CustomerTable from "@/components/ui/data-table";
import CustomerSearchBox from "@/app/_components/url-search-box";
import CreateCustomerForm from "@/app/_components/create-customer-form";
import RowsPerPage from "@/components/dashboard/rows-per-page";
import PaginationWtihEllepsis from "@/components/dashboard/pagination-with-ellepsis";
// CONSTANTS
import { customerTableColumns } from "@/lib/data/data-table-column-defs";

export default async function Customers({
  searchParams,
}: {
  // eslint-disable-next-line
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
    <div className="flex flex-col gap-6">
      <h5 className="text-lg font-semibold md:text-3xl">Customers</h5>
      <div className="flex items-center gap-3 ">
        <CustomerSearchBox />
        <CreateCustomerForm />
      </div>
      <CustomerTable
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
    </div>
  );
}
