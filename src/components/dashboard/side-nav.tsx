import AcmeLogo from "@/components/shared/AcmeLogo";
import NavLinks from "@/components/dashboard/nav-links";
import Link from "next/link";
import { Power } from "lucide-react";

export default function SideNav() {
  return (
    <aside className="flex h-full  flex-col gap-3 bg-gray-100 p-3 shadow-lg">
      <div className="flex h-40 items-end rounded-lg bg-blue-500 p-3 ">
        <AcmeLogo />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-3">
          <NavLinks />
        </ul>
        <Link
          className="flex items-center justify-between rounded-full border bg-white px-6 py-3  text-black animate-in hover:border-red-500 hover:bg-red-500 hover:text-white"
          href="/sign-out"
        >
          <p>Sign Out</p>
          <Power />
        </Link>
      </nav>
    </aside>
  );
}
