"use server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
// SCHEMA
import { customers } from "@/server/db/schema";
import { customerSchema, customerIDSchema } from "@/lib/schema";
// TYPES
import type { CustomerType, FormFieldErrorsType } from "@/lib/types";
// UTILS
import { db } from "@/server/db";

const createCustomer = async (customerData: CustomerType) => {
  const validatedFormData = customerSchema.safeParse(customerData);

  if (!validatedFormData.success) {
    let formFieldErrors: FormFieldErrorsType = {};

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

  const res = await db.insert(customers).values({
    id: randomUUID(),
    ...validatedFormData.data,
  });

  if (res.rowsAffected == 0)
    return { status: "FAILED", message: "Unable to add customer. Try Again!" };

  revalidatePath("/dashboard/customers ");
  return { status: "SUCCESS", message: "Customer added successfully." };
};

const deleteCustomer = async (formData: FormData) => {
  const validatedFormData = customerIDSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFormData.success)
    return { status: "FAILED", message: "Unable to delete customer" };

  const res = await db
    .delete(customers)
    .where(eq(customers.id, validatedFormData.data.id));

  if (res.rowsAffected == 0)
    return { status: "FAILED", message: "Unable to delete customer" };

  revalidatePath("/dashboard/customers ");
  return { status: "SUCCESS", message: "Customer removed successfully." };
};

export { createCustomer, deleteCustomer };
