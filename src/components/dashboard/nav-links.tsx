"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { dashboardNavList } from "@/components/dashboard/data";

export default function NavLinks() {
  const currentRoute = usePathname();

  return (
    <>
      {dashboardNavList.map((nav, index) => (
        <li key={index}>
          <Link
            href={nav.href}
            className={`flex w-full items-center justify-start gap-3 rounded-md  p-3 py-2 ${
              currentRoute === nav.href
                ? "bg-blue-200 text-blue-500"
                : "bg-transparent hover:bg-blue-200 hover:text-blue-500"
            }`}
          >
            <nav.Icon size={18} />
            <p>{nav.title}</p>
          </Link>
        </li>
      ))}
    </>
  );
}
