import { HydrateClient } from "@/trpc/server";
import LandingPage from "@/components/LandingPage";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = null;
  return (
    <HydrateClient>
      <LandingPage session={session} />
    </HydrateClient>
  );
}
