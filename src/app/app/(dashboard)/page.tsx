import Dashboard from "./dashboard";
import PostHogClient from "@/app/posthog";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // const session = await getServerAuthSession();
  // if (!session?.user?.id) {
  //   redirect("/login");
  // }
  const posthog = PostHogClient();
  // const flags = await posthog.getAllFlags(session?.user?.id);
  console.log("Demo post hog server side");
  // console.log(flags);
  await posthog.shutdown();

  return (
    <div>
      <Dashboard />
    </div>
  );
}
