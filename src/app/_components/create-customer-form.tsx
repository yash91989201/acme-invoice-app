"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
//  ACTIONS
import { createCustomer } from "@/server/actions/customer";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
import { useEdgeStore } from "@/lib/edgestore";
// SCHEMAS
import { CreateCustomerWithImageSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { CreateCustomerWithImageType } from "@/lib/schema";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// ICONS
import { Loader2, PlusIcon } from "lucide-react";

export default function CreateCustomerForm() {
  const { edgestore } = useEdgeStore();
  const createCustomerModal = useToggle(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const createCustomerForm = useForm<CreateCustomerWithImageType>({
    shouldUseNativeValidation: true,
    resolver: zodResolver(CreateCustomerWithImageSchema),
    defaultValues: {
      image: new File([], ""),
    },
  });
  const { handleSubmit, reset, formState, control } = createCustomerForm;

  const uploadImage = async (customerImage: File) => {
    const uploadedImage = await edgestore.publicFiles.upload({
      file: customerImage,
      onProgressChange: (progress) => {
        setFileUploadProgress(progress);
      },
    });
    return uploadedImage.url;
  };

  const createCustomerAction: SubmitHandler<
    CreateCustomerWithImageType
  > = async (data) => {
    const imageUrl = await uploadImage(data.image);
    const actionResponse = (await createCustomer({
      ...data,
      image: imageUrl,
    })) as CreateCustomerFormStatusType;

    switch (actionResponse.status) {
      case "SUCCESS": {
        reset();
        setFileUploadProgress(0);
        createCustomerModal.close();
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
      open={createCustomerModal.isOpen}
      onOpenChange={() => {
        reset();
        createCustomerModal.toggle();
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center gap-3">
          <PlusIcon className="size-4 md:size-6" />
          <p className="text-sm md:text-base">Add Customer</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <Form {...createCustomerForm}>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(createCustomerAction)}
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

            <FormField
              name="image"
              control={control}
              render={({ field }) => {
                /* eslint-disable-next-line */
                const { value, onChange, ...fieldPropsWithoutValue } = field;
                return (
                  <FormItem>
                    <FormLabel>Customer Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) =>
                          onChange(e.target.files ? e.target.files[0] : null)
                        }
                        {...fieldPropsWithoutValue}
                      />
                    </FormControl>
                    <FormDescription>
                      {fileUploadProgress > 0 && (
                        <Progress className="h-2" value={fileUploadProgress} />
                      )}
                    </FormDescription>
                  </FormItem>
                );
              }}
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
