"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// CUSTOM COMPONENTS
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// ICONS
import { Loader2, Power } from "lucide-react";

export default function SignOutModal() {
  const signOutModal = useToggle(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signoutUser = async () => {
    setIsSigningOut(true);
    await signOut({ redirect: true, callbackUrl: window.origin });
    setIsSigningOut(false);
  };

  return (
    <Dialog open={signOutModal.isOpen} onOpenChange={signOutModal.toggle}>
      <DialogTrigger asChild>
        <Button className="flex h-fit items-center justify-between rounded-full border bg-white p-2 text-black  animate-in hover:border-red-500 hover:bg-red-500 hover:text-white md:px-6 md:py-3">
          <p className="hidden md:block md:text-lg">Sign Out</p>
          <Power className="size-4 md:size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-8 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to Sign Out ?</DialogTitle>
        </DialogHeader>
        <p>After signing out you will be taken to our landing page.</p>
        <DialogFooter>
          <Button variant="outline" onClick={signOutModal.close}>
            No, Step Back
          </Button>
          <Button
            variant="destructive"
            className="flex items-center justify-center gap-3"
            onClick={signoutUser}
            disabled={isSigningOut}
          >
            <p>Yes, SignOut</p>
            {isSigningOut && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
