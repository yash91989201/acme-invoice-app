import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
// UTILS
import { getServerAuthSession } from "@/server/auth";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
import AcmeLogo from "@/components/shared/AcmeLogo";
// ICONS
import { LogIn } from "lucide-react";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session !== null) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col gap-3 p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="grid grid-cols-[36%_1fr]">
        <div className="flex flex-col items-start justify-center gap-3 rounded-lg bg-gray-100 p-12">
          <div className="max-w-[480px] [&>h3]:inline [&>h3]:text-2xl">
            <h3 className="mr-2  font-semibold ">Welcome to Acme Invoice,</h3>
            <h3>
              manage your customers, invoices and revenue in one dashboard.
            </h3>
          </div>
          <Button className="gap-3 bg-blue-500" asChild>
            <Link href="/sign-in">
              <p className="text-lg font-medium">SignIn</p>
              <LogIn size={16} />
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12 lg:w-full">
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={320}
            className="md:hidden"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
      </div>
    </main>
  );
}
