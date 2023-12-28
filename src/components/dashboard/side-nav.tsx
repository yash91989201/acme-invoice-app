import AcmeLogo from "@/components/shared/AcmeLogo";
import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLinks from "@/components/dashboard/nav-links";

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
        <Button
          className="flex items-center gap-3 rounded-full border bg-white text-black hover:border-red-600 hover:bg-red-600 hover:text-white"
          variant="default"
        >
          <Power size={16} />
          <p className="text-lg">Sign Out</p>
        </Button>
      </nav>
    </aside>
  );
}
