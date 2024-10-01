"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { api } from "@/trpc/react";
import { usePlaidLink } from "react-plaid-link";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

export function ConnectAccount({ linkToken }: { linkToken: string }) {
  const queryClient = useQueryClient();
  const exchangePublicToken = api.service.exchangePublicToken.useMutation();
  const queryKey = getQueryKey(api.service.getPlaidItems);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken) => {
      exchangePublicToken.mutate(
        { publicToken },
        {
          onSuccess: () => {
            toast.success("Account connected successfully");
            void queryClient.invalidateQueries({ queryKey });
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    },
  });

  return (
    <Button
      onClick={() => {
        open();
      }}
      disabled={!ready}
      className="w-full rounded-xl py-6 text-lg transition-all duration-300 hover:scale-105"
    >
      <PlusCircle className="mr-2 h-5 w-5" />
      Connect a bank account
    </Button>
  );
}
