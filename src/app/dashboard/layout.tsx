import React from "react";
// UTILS
import { getServerAuthSession } from "@/server/auth";
// CUSTOM COMPONENTS
import SideNav from "@/components/dashboard/side-nav";
import NotSignedInModal from "@/components/dashboard/not-signedin-modal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
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
