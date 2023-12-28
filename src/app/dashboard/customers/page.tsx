// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import CreateCustomerForm from "@/app/_components/create-customer-form";
import DeleteCustomerForm from "@/app/_components/delete-customer-form";

export default async function Customers() {
  const customers = await api.customer.getAll.query();

  return (
    <>
      <div className="flex justify-between">
        <h5 className="text-2xl font-semibold">Customers</h5>
        <CreateCustomerForm />
      </div>

      <div>
        <div>
          {customers?.map((customer, index) => (
            <div key={index} className="">
              <p>{customer.name}</p>
              <p>{customer.email}</p>
              <DeleteCustomerForm id={customer.id} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
