"use client";
import { redirect } from "next/navigation";
// UTILS
import { renderOnClient } from "@/lib/utils";
// CUSTOM COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SignInProviders from "@/components/dashboard/sign-in-providers";

function NotSignedInModal() {
  return (
    <Dialog defaultOpen={true} onOpenChange={() => redirect("/")}>
      <DialogContent
        className="gap-12 sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>You are not signed in</DialogTitle>
        </DialogHeader>
        <SignInProviders />
      </DialogContent>
    </Dialog>
  );
}

export default renderOnClient(NotSignedInModal);
