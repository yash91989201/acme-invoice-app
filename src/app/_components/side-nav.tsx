// CUSTOM COMPONENTS
import AcmeLogo from "@/components/shared/AcmeLogo";
import NavLinks from "@/components/dashboard/nav-links";
import SignOutModal from "@/app/_components/sign-out-modal";

export default function SideNav() {
  return (
    <aside className="flex h-full  flex-col gap-3 bg-gray-50 p-3">
      <div className="flex h-24 items-end rounded-lg bg-primary p-3 md:h-40 ">
        <AcmeLogo />
      </div>
      <nav className="flex md:flex-1 md:flex-col">
        <ul className="flex flex-1 gap-3 md:flex-col ">
          <NavLinks />
        </ul>
        <SignOutModal />
      </nav>
    </aside>
  );
}
