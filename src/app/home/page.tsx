import { HydrateClient } from "@/trpc/server";
import LandingPage from "@/components/LandingPage";

export default async function Home() {

  const session = null;
  return (
    <HydrateClient>
      <LandingPage session={session} />
    </HydrateClient>
  );
}
