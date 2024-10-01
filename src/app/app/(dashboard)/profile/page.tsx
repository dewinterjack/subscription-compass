import { ConnectAccount } from "./connect-account";
import { createTRPCContext } from "@/server/api/trpc";
import type { Session } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
  const data = await response.json();
  return data.link_token as string;
};

export default async function ProfilePage(req: Request) {
  const ctx = await createTRPCContext({ headers: req.headers });
  if (!ctx.session) {
    redirect("/login");
  }
  const linkToken = await getLinkToken(ctx.session);
  return (
    <div>
      <h1>Profile</h1>
      <ConnectAccount linkToken={linkToken} />
    </div>
  );
}
