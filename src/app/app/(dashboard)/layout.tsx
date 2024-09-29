import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard | SubsCompass",
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div>{children}</div>;
}
