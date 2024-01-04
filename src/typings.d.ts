type CustomerFormErrorsType = {
  name?: string;
  email?: string;
  image?: string;
};

type CreateCustomerFormInitialType = {
  status: "UNINITIALIZED";
  errors: CustomerFormErrorsType;
  message: string;
};

type CreateCustomerFormSuccessType = {
  status: "SUCCESS";
  message: string;
};

type CreateCustomerFormFailType = {
  status: "FAILED";
  errors?: CustomerFormErrorsType;
  message: string;
};

type CreateCustomerFormStatusType =
  | CreateCustomerFormInitialType
  | CreateCustomerFormSuccessType
  | CreateCustomerFormFailType;

type DeleteCustomerFormStatusType = {
  status: "UNINITIALIZED" | "SUCCESS" | "FAILED";
  message: string;
};

type InvoiceFormErrorsType = {
  amount?: string;
  status?: string;
  date?: string;
};

type CreateInvoiceFormInitialType = {
  status: "UNINITIALIZED";
  errors: InvoiceFormErrorsType;
  message: string;
};

type CreateInvoiceFormSuccessType = {
  status: "SUCCESS";
  message: string;
};

type CreateInvoiceFormFailType = {
  status: "FAILED";
  errors?: InvoiceFormErrorsType;
  message: string;
};

type CreateInvoiceFormStatusType =
  | CreateInvoiceFormInitialType
  | CreateInvoiceFormSuccessType
  | CreateInvoiceFormFailType;

type DeleteInvoiceFormStatusType = {
  status: "UNINITIALIZED" | "SUCCESS" | "FAILED";
  message: string;
};

type ModifyType<T, R> = Omit<T, keyof R> & R;
