import { getServerAuthSession } from "@/server/auth";
import DashboardHeader from "./header";
import { DashboardSidebar } from "./sidebar";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | SubsCompass",
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }

  const subscriptions: { cost: number }[] = [];

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar subscriptions={subscriptions} />
      <div className="flex flex-1 flex-col transition-all duration-300">
        <DashboardHeader user={session.user} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
