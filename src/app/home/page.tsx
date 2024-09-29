import { getServerAuthSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import LandingPage from "@/components/LandingPage";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <LandingPage session={session} />
    </HydrateClient>
  );
}
