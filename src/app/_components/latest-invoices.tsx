import Image from "next/image";
// UTILS
import { api } from "@/trpc/server";
import { formatAmount } from "@/lib/utils";
// TYPES
import type { InvoiceWithCustomerType } from "@/lib/schema";
// ICONS
import { RefreshCw } from "lucide-react";

export default async function LatestInvoices() {
  const latestInvoices =
    (await api.invoice.getLatest.query()) as InvoiceWithCustomerType[];

  return (
    <div className="flex flex-col gap-3">
      <h5 className="text-lg font-semibold md:text-2xl">Latest Invoices</h5>
      <div className="flex flex-col gap-6 rounded-lg bg-gray-100 p-4">
        {/* latest invoices list */}
        <div className="flex flex-col rounded-lg bg-white p-3 sm:px-6">
          {latestInvoices.map((invoice, index) => (
            <div
              key={index}
              className="flex flex-col justify-between gap-1  border-b p-3 last:border-b-0 sm:flex-row sm:gap-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative aspect-square w-9 overflow-hidden rounded-full">
                  <Image
                    src={invoice.customer.image}
                    alt={`${invoice.customer.name}'s profile image`}
                    fill
                    sizes="100vw"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-lg font-semibold">
                    {invoice.customer.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {invoice.customer.email}
                  </p>
                </div>
              </div>
              <p className="ml-12 sm:m-0">{formatAmount(invoice.amount)}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-gray-600 ">
          <RefreshCw className="size-4 md:size-5" />
          <p className="text-sm sm:text-base">Updated Just Now</p>
        </div>
      </div>
    </div>
  );
}
