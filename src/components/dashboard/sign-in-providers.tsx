import { getProviders } from "next-auth/react";
// CUSTOM COMPONENTS
import ProviderSignInButton from "./provider-sign-in-btn";

export default async function SignInProviders() {
  const providers = await getProviders();
  return (
    <div className="flex w-full flex-col items-center">
      {Object.values(providers!)?.map((provider, index) => (
        <ProviderSignInButton key={index} provider={provider} />
      ))}
    </div>
  );
}
