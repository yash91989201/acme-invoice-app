"use client";
import React from "react";
import Image from "next/image";
// TYPES
import type { ColumnDef } from "@tanstack/react-table";
// CUSTOM COMPONENTS
import DeleteCustomerForm from "@/app/_components/delete-customer-form";
import EditCustomerForm from "@/app/_components/edit-customer-form";
import { cn } from "../utils";
import { Check, Clock9 } from "lucide-react";
import EditInvoiceForm from "@/app/_components/edit-invoice-form";
import DeleteInvoiceForm from "@/app/_components/delete-invoice-form";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type CustomerTableColumnType = {
//   id: string;
//   name: string;
//   email: string;
//   total_invoices: number;
//   total_pending: number;
//   total_paid: number;
// };

// export const columns: ColumnDef<CustomerTableColumnType>[] = [
//   {
//     accessorKey: "image",
//     header: "",
//   },
//   {
//     accessorKey: "name",
//     header: "Name",
//   },
//   {
//     accessorKey: "total_invoices",
//     header: "Total Invoices",
//   },
//   {
//     accessorKey: "total_pending",
//     header: "Total Pending",
//   },
//   {
//     accessorKey: "total_paid",
//     header: "Total Paid",
//   },
// ];

export type CustomerTableColumnType = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export const customerTableColumns: ColumnDef<CustomerTableColumnType>[] = [
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

export type InvoiceTableColumnType = {
  id: string;
  amount: number;
  date: Date;
  status: "pending" | "paid";
  customer: CustomerTableColumnType;
};

export const invoiceTableColumns: ColumnDef<InvoiceTableColumnType>[] = [
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
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <p className="font-medium">{formattedAmount}</p>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const originalDate = new Date(row.getValue("date"));

      const formattedDate = new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(originalDate);

      return <p className="min-w-36 font-medium">{formattedDate}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div
          className={cn(
            "flex w-fit select-none items-center justify-center gap-3 rounded-full px-3 py-1 [&>svg]:size-4",
            status === "paid"
              ? "bg-green-100 text-green-500"
              : "bg-red-100 text-red-500",
          )}
        >
          {status === "paid" ? <Check /> : <Clock9 />}
          <p>{status}</p>
        </div>
      );
    },
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
