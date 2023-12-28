type CreateCustomerFormFieldErrorsType = {
  name?: string;
  email?: string;
  image?: string;
};

type CreateCustomerFormInitialType = {
  status: "UNINITIALIZED";
  errors: CreateCustomerFormFieldErrorsType;
  message: string;
};

type CreateCustomerFormSuccessType = {
  status: "SUCCESS";
  message: string;
};

type CreateCustomerFormFailType = {
  status: "FAILED";
  errors?: FormFieldErrorsType;
  message: string;
};

type CreateCustomerFormType =
  | CreateCustomerFormInitialType
  | CreateCustomerFormSuccessType
  | CreateCustomerFormFailType;

type DeleteCustomerFormType = {
  status: "UNINITIALIZED" | "SUCCESS" | "FAILED";
  message: string;
};
