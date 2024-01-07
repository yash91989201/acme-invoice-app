import { z } from "zod";

const CustomerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(6, { message: "First name is required." }),
  email: z.string().email(),
  image: z.string().url(),
});

const CreateCustomerSchema = z.object({
  name: z.string().min(6, { message: "First name is required." }),
  email: z.string().email(),
  image: z.string().url(),
});

const EditCustomerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(6, { message: "First name is required." }),
  email: z.string().email(),
});

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const CreateCustomerWithImageSchema = z.object({
  name: z.string().min(6, { message: "First name is required." }),
  email: z.string().email(),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
      "only .jpeg .jpg .png .webp files are accepted.",
    ),
});

const DeleteCustomerSchema = z.object({
  id: z.string().uuid(),
});

const InvoiceSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  amount: z.number(),
  status: z.enum(["pending", "paid"]).default("pending"),
  date: z.date(),
});

const CreateInvoiceSchema = z.object({
  customer_id: z.string(),
  amount: z.coerce.number({
    invalid_type_error: "Amount can only be in number.",
  }),
  status: z.enum(["pending", "paid"]).default("pending"),
  date: z.date(),
});

const EditInvoiceSchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]).default("pending"),
  date: z.date(),
});

const DeleteInvoiceSchema = z.object({
  id: z.string().uuid(),
});

type CustomerType = z.infer<typeof CustomerSchema>;

type CustomerWithInvoiceDataType = CustomerType & {
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

type CreateCustomerType = z.infer<typeof CreateCustomerSchema>;
type CreateCustomerWithImageType = z.infer<
  typeof CreateCustomerWithImageSchema
>;

type EditCustomerType = z.infer<typeof EditCustomerSchema>;
type DeleteCustomerType = z.infer<typeof DeleteCustomerSchema>;

type InvoiceType = z.infer<typeof InvoiceSchema>;
type InvoiceWithCustomerType = InvoiceType & {
  customer: CustomerType;
};

type InvoiceTableColumnType = InvoiceWithCustomerType;
type CreateInvoiceType = z.infer<typeof CreateInvoiceSchema>;
type CreateInvoiceFormInputType = Omit<CreateInvoiceType, "id">;
type EditInvoiceType = z.infer<typeof EditInvoiceSchema>;
type DeleteInvoiceType = z.infer<typeof DeleteInvoiceSchema>;

export {
  CustomerSchema,
  CreateCustomerSchema,
  CreateCustomerWithImageSchema,
  EditCustomerSchema,
  DeleteCustomerSchema,
  InvoiceSchema,
  CreateInvoiceSchema,
  EditInvoiceSchema,
  DeleteInvoiceSchema,
};

export type {
  CustomerType,
  CustomerWithInvoiceDataType,
  CreateCustomerType,
  CreateCustomerWithImageType,
  DeleteCustomerType,
  EditCustomerType,
  InvoiceType,
  InvoiceWithCustomerType,
  InvoiceTableColumnType,
  CreateInvoiceType,
  CreateInvoiceFormInputType,
  EditInvoiceType,
  DeleteInvoiceType,
};
