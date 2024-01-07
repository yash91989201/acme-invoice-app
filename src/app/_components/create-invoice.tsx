// UTILS
import { api } from "@/trpc/server";
import CreateInvoiceForm from "./create-invoice.form";

export default async function CreateInvoice() {
  const customers = await api.customer.getAll.query({});
  return <CreateInvoiceForm customers={customers.customers} />;
}

function CreateInvoiceSkeleton() {
  return (
    <div className="h-10 w-48  animate-pulse rounded-lg bg-gray-100"></div>
  );
}

export { CreateInvoiceSkeleton };
