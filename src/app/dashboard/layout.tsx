// TYPES
import { Suspense, type ReactNode } from "react";
// CUSTOM COMPONENTS
import SideNav from "@/app/_components/side-nav";
import NotSignedIn from "../_components/not-signed-in";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          <Suspense>
            <NotSignedIn />
          </Suspense>
          {children}
        </div>
      </div>
    </>
  );
}
