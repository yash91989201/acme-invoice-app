"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// ICONS
import { BookOpen, Home, Users } from "lucide-react";

export default function NavLinks() {
  const currentRoute = usePathname();

  return (
    <>
      {dashboardNavList.map((nav, index) => (
        <li key={index}>
          <Link
            href={nav.href}
            className={`flex w-full items-center  gap-3 rounded-md  p-3 ${
              currentRoute === nav.href
                ? "bg-blue-100 text-blue-600"
                : "bg-transparent hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            <nav.Icon className="size-5" />
            <p className="hidden md:block">{nav.title}</p>
          </Link>
        </li>
      ))}
    </>
  );
}

const dashboardNavList = [
  {
    href: "/dashboard",
    Icon: Home,
    title: "Home",
  },
  {
    href: "/dashboard/invoices",
    Icon: BookOpen,
    title: "Invoices",
  },
  {
    href: "/dashboard/customers",
    Icon: Users,
    title: "Customers",
  },
];
