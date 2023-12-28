"use client";
import { useFormStatus } from "react-dom";
// TYPES
import type { DeleteCustomerType } from "@/lib/types";
import { deleteCustomer } from "@/server/actions/customer";
// CUSTOM COMPONENTS
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
// ICONS
import { Loader2, Trash } from "lucide-react";

export default function DeleteCustomerForm({ id }: DeleteCustomerType) {
  const deleteCustomerAction = async (formData: FormData) => {
    const res = (await deleteCustomer(formData)) as DeleteCustomerFormType;
    switch (res.status) {
      case "SUCCESS": {
        toast({
          title: res.message,
        });
        break;
      }
      case "FAILED": {
        toast({
          title: res.message,
        });
        break;
      }
    }
  };

  return (
    <form action={deleteCustomerAction}>
      <Input className="hidden" name="id" value={id} readOnly />
      <DeleteCustomerButton />
    </form>
  );
}

const DeleteCustomerButton = () => {
  const formStatus = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={formStatus.pending}
      variant="destructive"
      className="disabled:cursor-not-allowed"
    >
      {formStatus.pending ? <Loader2 className="animate-spin" /> : <Trash />}
    </Button>
  );
};
