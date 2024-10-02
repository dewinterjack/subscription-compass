import type { Session } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountList from "./account-list";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import ConnectedProviderButton from "./connected-provider";

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
    <div className="flex flex-row space-y-4">
      <AccountList linkToken={linkToken} />
      <div className="mx-auto mt-4 flex flex-col space-y-1">
        <h2 className="text-stone-600 dark:text-stone-400">
          Connected Providers
        </h2>
        <ConnectedProviderButton
          provider="discord"
          isConnected={isConnected("discord")}
          userId={session.user.id}
          totalConnectedProviders={totalConnectedProviders}
        />
        <ConnectedProviderButton
          provider="github"
          isConnected={isConnected("github")}
          userId={session.user.id}
          totalConnectedProviders={totalConnectedProviders}
        />
      </div>
    </div>
  );
}
