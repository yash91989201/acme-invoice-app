"use client";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
// ACTIONS
import { deleteInvoice } from "@/server/actions/invoice";
// TYPES
import type { DeleteInvoiceType } from "@/lib/schema";
// CUSTOM COMPONENTS
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// ICONS
import { Loader2, Trash } from "lucide-react";

export default function DeleteInvoiceForm({ id }: DeleteInvoiceType) {
  const deleteCustomerAction = async (formData: FormData) => {
    const actionResponse = (await deleteInvoice(
      formData,
    )) as DeleteInvoiceFormStatusType;
    switch (actionResponse.status) {
      case "SUCCESS": {
        toast.warning(actionResponse.message);
        break;
      }
      case "FAILED": {
        toast.error(actionResponse.message);
        break;
      }
    }
  };

  return (
    <form action={deleteCustomerAction} className="w-full">
      <Input className="hidden" name="id" value={id} readOnly />
      <DeleteInvoiceButton />
    </form>
  );
}

const DeleteInvoiceButton = () => {
  const formStatus = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={formStatus.pending}
      variant="ghost"
      className="flex h-fit w-full items-center justify-start gap-2 rounded-sm  px-2 py-1.5 text-sm hover:bg-red-100 hover:text-red-500 disabled:cursor-not-allowed"
      title="Delete Customer"
    >
      {formStatus.pending ? (
        <Loader2 className="animate-spin" size={14} />
      ) : (
        <Trash size={14} />
      )}
      <p>Delete</p>
    </Button>
  );
};
