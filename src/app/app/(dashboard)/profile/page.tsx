import type { Session } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountList from "./account-list";
import { getServerAuthSession } from "@/server/auth";
import LoginButton from "../../(auth)/login/login-button";

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
  const linkToken = await getLinkToken(session);
  return (
    <div>
      <LoginButton provider="discord" />
      <LoginButton provider="github" />
      <AccountList linkToken={linkToken} />
    </div>
  );
}
