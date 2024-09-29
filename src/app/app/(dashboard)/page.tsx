import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div>
      <Dashboard user={session.user} />
    </div>
  );
}
