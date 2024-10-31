import AccountList from "./account-list";
import { client } from "@/server/plaid";
import { db } from "@/server/db";
import EditableProfile from "./editable-profile";
import RecurringTransactions from "./recurring-transactions";
import { currentUser } from "@clerk/nextjs/server";
import type { CountryCode, Products } from "plaid";

const getLinkToken = async (userId: string) => {
  const request = {
    user: {
      client_user_id: userId,
    },
    client_name: "SubsCompass",
    products: ["transactions"] as Products[],
    language: "en",
    webhook: "https://webhook.example.com",
    country_codes: ["GB"] as CountryCode[],
  };

  const { data } = await client.linkTokenCreate(request);
  return data.link_token;
};

export default async function ProfilePage() {
  const clerkUser = await currentUser();
  const user = await db.user.findUnique({
    where: { clerkId: clerkUser?.id },
    select: { firstName: true, email: true, id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const linkToken = await getLinkToken(user.id);

  return (
    <div className="flex flex-col space-y-4">
      <div className="mx-auto mt-4 w-full max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold">Profile</h1>
        <EditableProfile
          initialName={user.firstName ?? ""}
          userId={user.id}
          email={user.email ?? ""}
        />
      </div>
      <div className="mx-auto w-full max-w-2xl">
        <AccountList linkToken={linkToken} />
        <RecurringTransactions />
      </div>
    </div>
  );
}
