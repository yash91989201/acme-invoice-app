import type { z } from "zod";
import type { customerSchema, customerIDSchema } from "@/lib/schema";

type CustomerType = z.infer<typeof customerSchema>;
type DeleteCustomerType = z.infer<typeof customerIDSchema>;

type FormFieldErrorsType = {
  name?: string;
  email?: string;
  image?: string;
};

export type { CustomerType, DeleteCustomerType, FormFieldErrorsType };
