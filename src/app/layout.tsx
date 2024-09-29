import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SubsCompass",
  description: "Track your subscriptions in one place.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    images: ["/api/og"],
    url: "https://www.subscompass.com",
    title: "SubsCompass",
    siteName: "SubsCompass",
    description: "Track your subscriptions in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <meta
          name="google-site-verification"
          content="0gSdTFwzVs4Qvw2pcRAQwKxJKgRAu3Pkw4ga6ihL5_8"
        />
      </head>
      <body>
        <TRPCReactProvider>
          {children}
          <Toaster className="dark:hidden" />
          <Toaster theme="dark" className="hidden dark:block" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
