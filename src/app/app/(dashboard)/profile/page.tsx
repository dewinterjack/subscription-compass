import type { Session } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountList from "./account-list";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import ConnectedProviderButton from "./connected-provider";
import EditableProfile from "./editable-profile";
import PlaidResponse from "../plaid-response";

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

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  if (!user) {
    throw new Error("User not found");
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
    <div className="flex flex-col space-y-4">
      <div className="mx-auto mt-4 w-full max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold">Profile</h1>
        <EditableProfile
          initialName={user.name}
          userId={session.user.id}
          email={user.email}
        />

        <h2 className="mb-2 mt-6 text-xl font-semibold text-stone-600 dark:text-stone-400">
          Connected Providers
        </h2>
        <div className="flex flex-col space-y-2">
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
      <div className="mx-auto w-full max-w-2xl">
        <AccountList linkToken={linkToken} />
      </div>
      <div className="mx-auto w-full max-w-2xl">
        <PlaidResponse />
      </div>
    </div>
  );
}
