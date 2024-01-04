import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { twMerge } from "tailwind-merge";
// TYPES
import type { ClassValue } from "clsx";
import type { FunctionComponent } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function renderOnClient<T>(Component: FunctionComponent<T>) {
  return dynamic(() => Promise.resolve(Component), { ssr: false });
}

export { cn, renderOnClient };
