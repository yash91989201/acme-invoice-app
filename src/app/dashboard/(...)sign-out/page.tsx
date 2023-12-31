"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
// CUSTOM COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signoutUser = async () => {
    setIsSigningOut(true);
    await signOut({ redirect: true, callbackUrl: window.origin });
    setIsSigningOut(false);
  };

  return (
    <Dialog defaultOpen={true} onOpenChange={() => router.back()}>
      <DialogContent className="gap-8 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to Sign Out ?</DialogTitle>
        </DialogHeader>
        <p>After signing out you will be taken to our landing page.</p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => router.back()}>
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
