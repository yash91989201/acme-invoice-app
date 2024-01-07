import { api } from "@/trpc/server";
import CreateInvoiceForm from "./create-invoice.form";

export default async function CreateInvoice() {
  const customers = await api.customer.getAll.query({});
  return <CreateInvoiceForm customers={customers.customers} />;
}
