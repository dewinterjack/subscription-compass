import Dashboard from "./dashboard";
import PostHogClient from "@/app/posthog";

export default async function DashboardPage() {
  const posthog = PostHogClient();
  await posthog.shutdown();

  return (
    <div>
      <Dashboard />
    </div>
  );
}
