"use client";

import { useState } from "react";
import { Plus, ShoppingBasket, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProPlanModal from "./pro-plan-modal";
import LoadingDots from "@/components/icons/loading-dots";

export function SubscriptionsSection() {
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const {
    data: subscriptions,
    refetch,
    isLoading,
  } = api.subscription.getAll.useQuery();
  const { data: trials, refetch: refetchTrials } = api.trial.getAll.useQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddSubscription = api.subscription.create.useMutation({
    onSuccess: () => {
      toast.success("Subscription added successfully.");
      setIsDialogOpen(false);
      void refetch();
    },
    onError: () => {
      toast.error("Failed to add subscription.");
    },
  });

  const handleAddTrial = api.trial.create.useMutation({
    onSuccess: () => {
      toast.success("Trial added successfully.");
      setIsDialogOpen(false);
      void refetchTrials();
    },
  });

  const handleDeleteSubscription = api.subscription.delete.useMutation({
    onSuccess: () => {
      toast.success("Subscription deleted.");
      void refetch();
    },
    onError: () => {
      toast.error("Failed to delete subscription.");
    },
  });

  const handleDeleteTrial = api.trial.delete.useMutation({
    onSuccess: () => {
      toast.success("Trial deleted.");
      void refetchTrials();
    },
    onError: () => {
      toast.error("Failed to delete trial.");
    },
  });

  const isProUser = false;

  const handleImport = () => {
    if (isProUser) {
      toast.success("Not implemented yet.");
    } else {
      setIsProModalOpen(true);
    }
  };

  const tableItems = [
    ...(subscriptions?.map((sub) => ({
      id: sub.id,
      name: sub.name,
      cost: sub.cost,
      billingCycle: sub.billingCycle,
      type: "subscription" as const,
    })) ?? []),
    ...(trials?.map((trial) => ({
      id: trial.id,
      name: trial.name,
      cost: 0,
      billingCycle: "Trial ends " + new Date(trial.endAt).toLocaleDateString(),
      type: "trial" as const,
    })) ?? []),
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Your Subscriptions</CardTitle>
          <CardDescription>
            Manage and track your active subscriptions
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant={isProUser ? "default" : "outline"}
                  onClick={handleImport}
                  className={isProUser ? "" : "opacity-50"}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </TooltipTrigger>
              {!isProUser && (
                <TooltipContent>
                  <p>Pro feature. Upgrade to use.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        {tableItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-12">
            <div className="rounded-full bg-muted p-3">
              <ShoppingBasket className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">No subscriptions yet</h3>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t added any subscriptions. Add one to get started.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex h-full items-center justify-center">
                      <LoadingDots />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tableItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.type === "subscription" ? (
                        <>
                          {CURRENCY_SYMBOL}
                          {(item.cost / 100).toFixed(2)}
                        </>
                      ) : (
                        "Free"
                      )}
                    </TableCell>
                    <TableCell>{item.billingCycle}</TableCell>
                    <TableCell>
                      <span
                        className={`capitalize ${item.type === "trial" ? "text-blue-500" : "text-green-500"}`}
                      >
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          if (item.type === "subscription") {
                            handleDeleteSubscription.mutate({ id: item.id });
                          } else {
                            handleDeleteTrial.mutate({ id: item.id });
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <AddSubscriptionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddSubscription={(subscription) =>
          handleAddSubscription.mutate(subscription)
        }
        onAddTrial={(trial) => handleAddTrial.mutate(trial)}
      />
      <ProPlanModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onSubscribe={() => {
          console.log("User subscribed to Pro plan");
        }}
      />
    </Card>
  );
}
