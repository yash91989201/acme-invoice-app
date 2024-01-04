"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { createInvoice } from "@/server/actions/invoice";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// UTILS
import { cn } from "@/lib/utils";
// SCHEMA
import { CreateInvoiceSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { CreateInvoiceFormInputType, CustomerType } from "@/lib/schema";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// ICONS
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Clock9,
  Loader2,
  PlusIcon,
} from "lucide-react";

export default function CreateInvoiceForm({
  customers,
}: {
  customers: CustomerType[];
}) {
  const createInvoiceModal = useToggle(false);

  const createInvoiceForm = useForm<CreateInvoiceFormInputType>({
    shouldUseNativeValidation: true,
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues: {
      status: "pending",
    },
  });
  const { handleSubmit, reset, formState, control, setValue } =
    createInvoiceForm;

  const createInvoiceAction: SubmitHandler<CreateInvoiceFormInputType> = async (
    data,
  ) => {
    const actionResponse = (await createInvoice(
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
        <Button className="flex items-center justify-center gap-3">
          <PlusIcon className="size-4 md:size-6" />
          <p className="text-sm md:text-base">Create Invoice</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>
        <Form {...createInvoiceForm}>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(createInvoiceAction)}
          >
            <FormField
              name="customer_id"
              control={control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Select Customer</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          role="combobox"
                          variant="outline"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? customers?.find(
                                (customer) => customer.id === field.value,
                              )?.name
                            : "Select Customer"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[375px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search Customer ..." />
                        <CommandEmpty>No Customers Available</CommandEmpty>
                        <ScrollArea className="max-h-60 min-h-fit w-full overflow-auto">
                          <CommandGroup>
                            {customers?.map((customer) => (
                              <CommandItem
                                value={customer.id}
                                key={customer.id}
                                onSelect={() =>
                                  setValue("customer_id", customer.id)
                                }
                                className="aria-selected:bg-primary/10"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    customer.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {customer.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </ScrollArea>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

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
                      <FormItem className="relative flex items-center space-x-3 space-y-0">
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
                      <FormItem className="relative flex items-center space-x-3 space-y-0">
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
              className="flex w-full items-center justify-center gap-3 disabled:cursor-not-allowed"
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
