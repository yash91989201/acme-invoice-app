"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { editInvoice } from "@/server/actions/invoice";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// UTILS
import { cn } from "@/lib/utils";
// SCHEMA
import { EditInvoiceSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { EditInvoiceType } from "@/lib/schema";
// CUSTOM COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// ICONS
import { CalendarIcon, Check, Clock9, Loader2, Pencil } from "lucide-react";

export default function EditInvoiceForm({
  initialInvoiceData,
}: {
  initialInvoiceData: EditInvoiceType;
}) {
  const createInvoiceModal = useToggle(false);

  const createInvoiceForm = useForm<EditInvoiceType>({
    shouldUseNativeValidation: true,
    resolver: zodResolver(EditInvoiceSchema),
    defaultValues: initialInvoiceData,
  });
  const { handleSubmit, reset, formState, control } = createInvoiceForm;

  const createInvoiceAction: SubmitHandler<EditInvoiceType> = async (data) => {
    const actionResponse = (await editInvoice(
      data,
    )) as CreateInvoiceFormStatusType;

    switch (actionResponse.status) {
      case "SUCCESS": {
        reset();
        createInvoiceModal.close();
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
      open={createInvoiceModal.isOpen}
      onOpenChange={() => {
        reset();
        createInvoiceModal.toggle();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="flex h-fit w-full items-center justify-start gap-2 px-2 py-1.5 text-sm hover:bg-amber-100 hover:text-amber-500 "
          variant="ghost"
          title="Edit Invoice Data"
        >
          <Pencil size={14} />
          <p>Edit</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>
        <Form {...createInvoiceForm}>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(createInvoiceAction)}
          >
            <FormField
              name="amount"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Amount</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Amount In Rs." />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex gap-3"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="paid"
                            checked={field.value === "paid"}
                          />
                        </FormControl>
                        <FormLabel className="flex w-fit select-none items-center justify-center gap-3 rounded-full bg-green-100 px-3 py-1 text-green-500 [&>svg]:size-4">
                          <Check />
                          <p>Paid</p>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="pending"
                            checked={field.value === "pending"}
                          />
                        </FormControl>
                        <FormLabel className="flex w-fit select-none items-center justify-center gap-3 rounded-full bg-red-100 px-3 py-1 text-red-500 [&>svg]:size-4">
                          <Clock9 />
                          <p>Pending</p>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="date"
              control={control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Invoice Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a Date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <Button
              type="submit"
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
