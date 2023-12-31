"use client";
import { getProviders, signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { renderOnClient } from "@/lib/utils";
import { GithubIcon } from "lucide-react";
import type { ReactNode } from "react";

const providerIcons: { Icon: ReactNode }[] = [
  {
    Icon: <GithubIcon />,
  },
];

async function NotSignedInModal() {
  const providers = await getProviders();

  return (
    <Dialog defaultOpen={true} onOpenChange={() => redirect("/")}>
      <DialogContent
        className="gap-12 sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>You are not signed in</DialogTitle>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          {providers == null ? (
            <Button onClick={() => redirect("/")}>Landing Page</Button>
          ) : (
            Object.values(providers)?.map((provider, index) => (
              <Button
                key={provider.id}
                variant="secondary"
                className="gap-3 px-6 py-4"
                onClick={() => signIn(provider.id)}
              >
                {providerIcons[index]?.Icon as ReactNode}
                Sign in with {provider.name}
              </Button>
            ))
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default renderOnClient(NotSignedInModal);
