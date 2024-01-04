"use server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
// UTILS
import { db } from "@/server/db";
// SCHEMA
import {
  CreateInvoiceSchema,
  EditInvoiceSchema,
  DeleteInvoiceSchema,
} from "@/lib/schema";
import { invoices } from "@/server/db/schema";
// TYPES
import type { CreateInvoiceType, EditInvoiceType } from "@/lib/schema";

const createInvoice = async (invoiceData: CreateInvoiceType) => {
  const validatedFormData = CreateInvoiceSchema.safeParse(invoiceData);

  if (!validatedFormData.success) {
    let formFieldErrors: CustomerFormErrorsType = {};

    validatedFormData.error.errors.map((error) => {
      formFieldErrors = {
        ...formFieldErrors,
        [`${error.path[0]}`]: error.message,
      };
    });

    return {
      status: "FAILED",
      errors: formFieldErrors,
      message: "Invalid data given.",
    };
  }

  const createCustomer = await db.insert(invoices).values({
    id: randomUUID(),
    ...validatedFormData.data,
  });

  if (createCustomer.rowsAffected == 0)
    return {
      status: "FAILED",
      message: "Unable to create invoice. Try Again!",
    };

  revalidatePath("/dashboard/invoices");
  return { status: "SUCCESS", message: "Inoice created successfully." };
};

const editInvoice = async (editInvoiceData: EditInvoiceType) => {
  const validatedFormData = EditInvoiceSchema.safeParse(editInvoiceData);

  if (!validatedFormData.success) {
    let formFieldErrors: CustomerFormErrorsType = {};

    validatedFormData.error.errors.map((error) => {
      formFieldErrors = {
        ...formFieldErrors,
        [`${error.path[0]}`]: error.message,
      };
    });

    return {
      status: "FAILED",
      errors: formFieldErrors,
      message: "Invalid data given.",
    };
  }

  const dbEditCustomer = await db
    .update(invoices)
    .set({
      status: validatedFormData.data.status,
      date: validatedFormData.data.date,
      amount: validatedFormData.data.amount,
    })
    .where(eq(invoices.id, validatedFormData.data.id));

  if (dbEditCustomer.rowsAffected == 0)
    return { status: "FAILED", message: "Unable to add customer. Try Again!" };

  revalidatePath("/dashboard/customers ");
  return { status: "SUCCESS", message: "Customer edited successfully." };
};

const deleteInvoice = async (formData: FormData) => {
  const validatedFormData = DeleteInvoiceSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFormData.success)
    return { status: "FAILED", message: "Unable to delete invoice" };

  const res = await db
    .delete(invoices)
    .where(eq(invoices.id, validatedFormData.data.id));

  if (res.rowsAffected == 0)
    return { status: "FAILED", message: "Unable to delete invoice" };

  revalidatePath("/dashboard/customers ");
  return { status: "SUCCESS", message: "Invoice removed successfully." };
};

export { createInvoice, editInvoice, deleteInvoice };
