"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// CUSTOM HOOKS
import useToggle from "@/hooks/useToggle";
//  UTILS
import { createCustomer } from "@/server/actions/customer";
// SCHEMA
import { customerSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { CustomerType } from "@/lib/types";
// CUSTOM COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
// ICONS
import { Loader2 } from "lucide-react";

export default function CreateCustomerForm() {
  const customerModal = useToggle(false);

  const { register, handleSubmit, reset, formState } = useForm<CustomerType>({
    shouldUseNativeValidation: true,
    resolver: zodResolver(customerSchema),
  });

  const createCustomerAction: SubmitHandler<CustomerType> = async (data) => {
    const actionResponse = (await createCustomer(
      data,
    )) as CreateCustomerFormType;

    switch (actionResponse.status) {
      case "SUCCESS": {
        reset();
        customerModal.close();
        toast({
          title: actionResponse.message,
        });
        break;
      }
      case "FAILED": {
        toast({
          title: actionResponse.message,
          variant: "destructive",
        });
        break;
      }
    }
  };

  return (
    <Dialog open={customerModal.isOpen} onOpenChange={customerModal.toggle}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Customer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(createCustomerAction)}
        >
          <fieldset className="flex max-w-sm flex-col gap-3">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Customer Name</Label>
              <Input {...register("name")} />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Customer Email</Label>
              <Input {...register("email")} />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Customer Image</Label>
              <Input {...register("image")} />
            </div>
          </fieldset>
          <Button
            type="submit"
            variant="default"
            disabled={formState.isSubmitting}
            className="flex items-center justify-center gap-3 disabled:cursor-not-allowed"
          >
            {formState.isSubmitting ? (
              <>
                <h6>Submitting...</h6>
                <Loader2 className="animate-spin" />
              </>
            ) : (
              <h6>Submit</h6>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
