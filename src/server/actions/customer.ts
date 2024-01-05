"use server";
import { initEdgeStore } from "@edgestore/server";
import { initEdgeStoreClient } from "@edgestore/server/core";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
// UTILS
import { db } from "@/server/db";
// SCHEMA
import {
  CreateCustomerSchema,
  DeleteCustomerSchema,
  EditCustomerSchema,
} from "@/lib/schema";
import { customers, invoices } from "@/server/db/schema";
// TYPES
import type {
  CreateCustomerType,
  CustomerType,
  EditCustomerType,
} from "@/lib/schema";

const createCustomer = async (customerData: CreateCustomerType) => {
  const validatedFormData = CreateCustomerSchema.safeParse(customerData);

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

  const createCustomer = await db.insert(customers).values({
    id: randomUUID(),
    ...validatedFormData.data,
  });

  if (createCustomer.rowsAffected == 0)
    return { status: "FAILED", message: "Unable to add customer. Try Again!" };

  revalidatePath("/dashboard/customers");
  return { status: "SUCCESS", message: "Customer added successfully." };
};

const editCustomer = async (editCustomerFormData: EditCustomerType) => {
  const validatedFormData = EditCustomerSchema.safeParse(editCustomerFormData);

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
    .update(customers)
    .set({
      name: validatedFormData.data.name,
      email: validatedFormData.data.email,
    })
    .where(eq(customers.id, validatedFormData.data.id));

  if (dbEditCustomer.rowsAffected == 0)
    return { status: "FAILED", message: "Unable to add customer. Try Again!" };

  revalidatePath("/dashboard/customers");
  return { status: "SUCCESS", message: "Customer edited successfully." };
};

const es = initEdgeStore.create();
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
});

const edgeStoreBackendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});

const deleteCustomer = async (formData: FormData) => {
  const validatedFormData = DeleteCustomerSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFormData.success)
    return { status: "FAILED", message: "Unable to delete customer" };

  const customer = (await db.query.customers.findFirst({
    where: eq(customers.id, validatedFormData.data.id),
  })) as CustomerType;

  await db
    .delete(invoices)
    .where(eq(invoices.customer_id, validatedFormData.data.id));

  await edgeStoreBackendClient.publicFiles.deleteFile({
    url: customer.image,
  });

  const res = await db
    .delete(customers)
    .where(eq(customers.id, validatedFormData.data.id));

  if (res.rowsAffected == 0)
    return { status: "FAILED", message: "Unable to delete customer" };

  revalidatePath("/dashboard/customers");
  return { status: "SUCCESS", message: "Customer removed successfully." };
};

export { createCustomer, deleteCustomer, editCustomer };
