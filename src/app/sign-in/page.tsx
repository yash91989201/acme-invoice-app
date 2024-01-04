import { redirect } from "next/navigation";
import { getProviders } from "next-auth/react";
// UTILS
import { getServerAuthSession } from "@/server/auth";
// CUSTOM COMPONENTS
import ProviderSignInButton from "@/components/dashboard/provider-sign-in-btn";
import AcmeLogo from "@/components/shared/AcmeLogo";

export default async function Page() {
  const providers = await getProviders();
  const session = await getServerAuthSession();

  if (session !== null) redirect("/dashboard");

  return (
    <div className="flex h-screen w-screen items-center justify-center ">
      <div className="flex flex-col gap-3 sm:w-[425px]">
        <div className="flex h-40 w-full flex-col-reverse rounded-lg bg-blue-500 p-3 ">
          <AcmeLogo />
        </div>
        <div className="flex flex-col items-center  gap-6 rounded-lg bg-gray-50 p-3">
          <h3 className=" text-left text-lg font-semibold">Sign In to Acme</h3>
          <div className="">
            {Object.values(providers!)?.map((provider, index) => (
              <ProviderSignInButton key={index} provider={provider} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
