"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { usePlaidLink } from "react-plaid-link";

export function ConnectAccount({ linkToken }: { linkToken: string }) {
  const exchangePublicToken = api.service.exchangePublicToken.useMutation();
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken) => {
      exchangePublicToken.mutate({ publicToken });
    },
  });
  return (
    <Button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </Button>
  );
}
