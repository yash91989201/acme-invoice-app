"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//  ACTIONS
import { editCustomer } from "@/server/actions/customer";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// SCHEMA
import { EditCustomerSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { EditCustomerType } from "@/lib/schema";
// CUSTOM COMPONENTS
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// ICONS
import { Loader2, Pencil } from "lucide-react";

export default function EditCustomerForm({
  initialCustomerData,
}: {
  initialCustomerData: EditCustomerType;
}) {
  const editCustomerModal = useToggle(false);

  const editCustomerForm = useForm<EditCustomerType>({
    shouldUseNativeValidation: true,
    defaultValues: initialCustomerData,
    resolver: zodResolver(EditCustomerSchema),
  });

  const { handleSubmit, reset, formState, control } = editCustomerForm;

  const editCustomerAction: SubmitHandler<EditCustomerType> = async (data) => {
    const actionResponse = (await editCustomer(
      data,
    )) as CreateCustomerFormStatusType;

    switch (actionResponse.status) {
      case "SUCCESS": {
        reset();
        editCustomerModal.close();
        toast.success(actionResponse.message);
        break;
      }
      case "FAILED": {
        toast.error(actionResponse.message);
        break;
      }
    }
  };

  return (
    <Dialog
      open={editCustomerModal.isOpen}
      onOpenChange={() => {
        reset();
        editCustomerModal.toggle();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="flex h-fit w-full items-center justify-start gap-2 px-2 py-1.5 text-sm hover:bg-amber-100 hover:text-amber-500 "
          variant="ghost"
          title="Edit Customer Data"
        >
          <Pencil size={14} />
          <p>Edit</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...editCustomerForm}>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(editCustomerAction)}
          >
            <FormField
              name="name"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="default"
              disabled={formState.isSubmitting}
              className="flex items-center justify-center gap-3 disabled:cursor-not-allowed"
            >
              <h6 className="md:text-lg">Submit</h6>
              {formState.isSubmitting && <Loader2 className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
