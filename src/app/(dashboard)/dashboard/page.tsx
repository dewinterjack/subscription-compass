import PostHogClient from "@/app/posthog";
import Dashboard from "../dashboard";

export default async function DashboardPage() {
  const posthog = PostHogClient();
  await posthog.shutdown();

  return (
    <div>
      <Dashboard />
    </div>
  );
}
