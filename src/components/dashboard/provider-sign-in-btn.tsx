"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
// TYPES
import type { ClientSafeProvider } from "next-auth/react";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
// ICONS
import { Loader2 } from "lucide-react";

export default function ProviderSignInButton({
  provider,
}: {
  provider: ClientSafeProvider;
}) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signInUser = async () => {
    setIsSigningIn(true);
    await signIn(provider.id, {
      callbackUrl: "/dashboard",
      redirect: true,
    });
    setIsSigningIn(false);
  };

  return (
    <Button
      key={provider.id}
      variant="outline"
      className="flex items-center justify-center gap-3 p-3"
      onClick={signInUser}
      disabled={isSigningIn}
    >
      <p>Sign in with {provider.name}</p>
      {isSigningIn ? <Loader2 className="animate-spin" /> : <></>}
    </Button>
  );
}
