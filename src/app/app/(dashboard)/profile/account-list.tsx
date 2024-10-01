"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Landmark } from "lucide-react";
import { api } from "@/trpc/react";
import { ConnectAccount } from "./connect-account";

export default function AccountList({ linkToken }: { linkToken: string }) {
  const { data, isLoading, isFetching, error, refetch } =
    api.service.getPlaidItems.useQuery();
  const [isConnecting, setIsConnecting] = useState(false);
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl font-bold">
          Connected Accounts
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-full"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {isLoading ? (
            <AccountListSkeleton />
          ) : !data || data.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center text-gray-500"
            >
              No connected accounts. Connect your first account below.
            </motion.div>
          ) : (
            <motion.ul className="space-y-4">
              {data.map((item) => (
                <motion.li
                  key={item.institutionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="flex items-center p-4">
                      {/* TODO: fallback for logo */}
                      <Landmark className="mr-2 h-4 w-4" />
                      <span className="text-lg font-medium">
                        {item.institutionName}
                      </span>
                    </CardContent>
                  </Card>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        <div className="mt-6">
          <ConnectAccount
            linkToken={linkToken}
            onConnecting={setIsConnecting}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function AccountListSkeleton() {
  return (
    <ul className="space-y-4">
      {[1, 2, 3].map((i) => (
        <li key={i}>
          <Card>
            <CardContent className="flex items-center p-4">
              <Skeleton className="mr-4 h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
