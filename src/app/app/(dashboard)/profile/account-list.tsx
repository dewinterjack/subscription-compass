"use client";
import { api } from "@/trpc/react";

export default function AccountList() {
  const { data, isLoading, error } = api.service.getPlaidItems.useQuery();

  if (isLoading) return <div>Loading connected accounts...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || data.length === 0) return <div>No connected accounts.</div>;

  return (
    <div>
      <h2>Connected Accounts</h2>
      <ul>
        {data.map((item) => (
          <li key={item.institutionId}>{item.institutionName}</li>
        ))}
      </ul>
    </div>
  );
}
