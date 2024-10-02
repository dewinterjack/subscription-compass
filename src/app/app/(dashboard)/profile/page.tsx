import type { Session } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountList from "./account-list";
import { getServerAuthSession } from "@/server/auth";
import LoginButton from "../../(auth)/login/login-button";
import { db } from "@/server/db";

const getLinkToken = async (session: Session) => {
  const headersList = headers();
  console.log(headersList.get("host"));
  // server side fetch cannot call /api it needs the url
  const response = await fetch(
    `${process.env.NODE_ENV === "development" ? "http" : "https"}://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/create_link_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session.user.id }),
    },
  );
  const data = (await response.json()) as { link_token: string };
  return data.link_token;
};

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }
  const providers = await db.account
    .findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        provider: true,
      },
      distinct: ["provider"],
    })
    .then((accounts) => accounts.map((account) => account.provider));

  const linkToken = await getLinkToken(session);

  const isConnected = (provider: string) => providers.includes(provider);
  const totalConnectedProviders = providers.length;

  return (
    <div>
      <AccountList linkToken={linkToken} />
      <div className="mx-auto mt-4 flex max-w-sm flex-col space-y-2">
        <LoginButton
          provider="discord"
          isConnected={isConnected("discord")}
          userId={session.user.id}
          totalConnectedProviders={totalConnectedProviders}
        />
        <LoginButton
          provider="github"
          isConnected={isConnected("github")}
          userId={session.user.id}
          totalConnectedProviders={totalConnectedProviders}
        />
      </div>
    </div>
  );
}
