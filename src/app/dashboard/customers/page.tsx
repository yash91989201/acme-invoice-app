import { Suspense } from "react";
// CUSTOM COMPONENTS
import CustomerTable, {
  CustomerTableSkeleton,
} from "@/app/_components/customer-table";
import CustomerSearchBox from "@/app/_components/url-search-box";
import CreateCustomerForm from "@/app/_components/create-customer-form";

export default async function Customers({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  return (
    <div className="flex flex-col gap-6">
      <h5 className="text-lg font-semibold md:text-3xl">Customers</h5>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <CustomerSearchBox />
        <CreateCustomerForm />
      </div>
      <Suspense fallback={<CustomerTableSkeleton />}>
        <CustomerTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
