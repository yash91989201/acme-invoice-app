import dynamic from "next/dynamic";
import { twMerge } from "tailwind-merge";
// TYPES
import type React from "react";
import { type ClassValue, clsx } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function renderOnClient<T>(Component: React.FunctionComponent<T>) {
  return dynamic(() => Promise.resolve(Component), { ssr: false });
}

export { cn, renderOnClient };
