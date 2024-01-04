import "@/styles/globals.css";
import { inter } from "@/fonts";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import { EdgeStoreProvider } from "@/lib/edgestore";

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
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </TRPCReactProvider>
        <Toaster richColors theme="light" />
      </body>
    </html>
  );
}
