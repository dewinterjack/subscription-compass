import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import { PHProvider } from "./providers";
import dynamic from "next/dynamic";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider"

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "SubsCompass",
  description: "Simplify your subscription management with SubsCompass.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    images: ["/api/og"],
    url: "https://subscompass.com",
    title: "SubsCompass",
    siteName: "SubsCompass",
    description: "Simplify your subscription management with SubsCompass.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider signInFallbackRedirectUrl={`${process.env.NEXT_PUBLIC_APP_URL}`}>
      <html lang="en" className={`${GeistSans.variable}`}>
        <head>
          <meta
            name="google-site-verification"
            content="0gSdTFwzVs4Qvw2pcRAQwKxJKgRAu3Pkw4ga6ihL5_8"
          />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <PHProvider>
                <PostHogPageView />
                {children}
              </PHProvider>
              <ReactQueryDevtools initialIsOpen={false} />
              <Toaster className="dark:hidden" />
              <Toaster theme="dark" className="hidden dark:block" />
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
