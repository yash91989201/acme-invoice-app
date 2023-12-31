"use client";
import React from "react";
import Image from "next/image";
// UTILS
import { cn, formatAmount, formatDate } from "@/lib/utils";
// TYPES
import type { ColumnDef } from "@tanstack/react-table";
import type {
  CustomerType as CustomerTableColumnType,
  InvoiceWithCustomerType as InvoiceTableColumnType,
} from "@/lib/schema";
// CUSTOM COMPONENTS
import EditInvoiceForm from "@/app/_components/edit-invoice-form";
import EditCustomerForm from "@/app/_components/edit-customer-form";
import DeleteInvoiceForm from "@/app/_components/delete-invoice-form";
import DeleteCustomerForm from "@/app/_components/delete-customer-form";
// ICONS
import { Check, Clock9 } from "lucide-react";

const customerTableColumns: ColumnDef<CustomerTableColumnType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-6">
        <div className="relative aspect-square w-10 overflow-clip rounded-full border">
          <Image
            src={row.original.image}
            alt="customer display"
            fill
            sizes="100vw"
          />
        </div>
        <p>{row.original.name}</p>
      </div>
    ),
  },

  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "total_invoices",
    header: "Total Invoices",
  },
  {
    accessorKey: "total_paid",
    header: "Total Paid",
  },
  {
    accessorKey: "total_pending",
    header: "Total Pending",
  },
  {
    accessorKey: "edit",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex w-fit items-center justify-center gap-3">
        <EditCustomerForm initialCustomerData={row.original} />
        <DeleteCustomerForm id={row.original.id} />
      </div>
    ),
  },
];

const invoiceTableColumns: ColumnDef<InvoiceTableColumnType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative aspect-square w-10 overflow-clip rounded-full border">
          <Image
            src={row.original.customer.image}
            alt="customer display"
            fill
            sizes="100vw"
          />
        </div>
        <p>{row.original.customer.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <p>{row.original.customer.email}</p>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <p className="font-medium">{formatAmount(row.original.amount)}</p>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <p className="min-w-36 font-medium">{formatDate(row.original.date)}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={cn(
          "flex w-fit select-none items-center justify-center gap-2 rounded-full px-3 py-1 [&>svg]:size-4",
          row.original.status === "paid"
            ? "bg-green-100 text-green-500 [&>.pending-icon]:hidden"
            : "bg-red-100 text-red-500 [&>.paid-icon]:hidden",
        )}
      >
        <Check className="paid-icon" />
        <Clock9 className="pending-icon" />
        <p>{row.original.status}</p>
      </div>
    ),
  },
  {
    accessorKey: "edit",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex w-fit items-center justify-center gap-3">
        <EditInvoiceForm initialInvoiceData={row.original} />
        <DeleteInvoiceForm id={row.original.id} />
      </div>
    ),
  },
];

export { customerTableColumns, invoiceTableColumns };
