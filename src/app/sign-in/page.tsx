import { redirect } from "next/navigation";
import { getProviders } from "next-auth/react";
// UTILS
import { getServerAuthSession } from "@/server/auth";
// CUSTOM COMPONENTS
import ProviderSignInButton from "@/components/dashboard/provider-sign-in-btn";

export default async function Page() {
  const providers = await getProviders();
  const session = await getServerAuthSession();

  if (session !== null) redirect("/dashboard");

  return (
    <div className="flex h-screen w-screen items-center justify-center ">
      <div className="flex flex-col sm:w-[425px] ">
        <div className="flex h-40 w-full flex-col-reverse rounded-lg bg-blue-500 p-3 ">
          <h2 className=" text-3xl text-white">Acme Invoice</h2>
        </div>
        <div className="flex flex-col items-center gap-6 p-3">
          <h3 className="text-center text-lg font-semibold">Sign Options</h3>
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
