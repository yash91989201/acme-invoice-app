import "@/styles/globals.css";

import { cookies } from "next/headers";
import { inter } from "@/fonts";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Acme Invoice",
  description: "Invoice app to learn Next14",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
