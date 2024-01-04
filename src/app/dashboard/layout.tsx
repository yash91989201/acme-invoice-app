// UTILS
import { getServerAuthSession } from "@/server/auth";
// TYPES
import type { ReactNode } from "react";
// CUSTOM COMPONENTS
import SideNav from "@/app/_components/side-nav";
import NotSignedInModal from "@/app/_components/not-signed-in-modal";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {session == null ? <NotSignedInModal /> : children}
        </div>
      </div>
    </>
  );
}
