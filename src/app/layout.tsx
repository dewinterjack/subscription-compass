import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "SubCompass",
  description: "Track your subscriptions in one place.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    images: ["/api/og"],
    url: "https://subcompass.com",
    title: "SubCompass",
    siteName: "SubCompass",
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
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
