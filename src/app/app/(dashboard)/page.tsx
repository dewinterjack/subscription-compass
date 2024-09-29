import { redirect } from "next/navigation";
import SignOutButton from "./sign-out-button";
import { getServerAuthSession } from "@/server/auth";

export default async function Dashboard() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div>
      <h1>Your dashboard</h1>
      <SignOutButton />
    </div>
  );
}
