"use client";

import { useState } from "react";
import { Plus, ShoppingBasket, Upload, MoreHorizontal } from "lucide-react";
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
import { api, RouterOutputs } from "@/trpc/react";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProPlanModal from "./pro-plan-modal";
import LoadingDots from "@/components/icons/loading-dots";
import type { SubscriptionWithLatestPeriod } from "@/types";
import type { InputType } from "@/server/api/root";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SubscriptionsSection() {
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const { data: subscriptions, isLoading } = api.subscription.getAll.useQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<
    InputType["subscription"]["update"] | undefined
  >();

  const utils = api.useUtils();

  const handleAddSubscription = api.subscription.create.useMutation({
    onSuccess: () => {
      toast.success("Subscription added successfully.");
      setIsDialogOpen(false);
      void utils.subscription.invalidate();
    },
    onError: () => {
      toast.error("Failed to add subscription.");
    },
  });

  const handleDeleteSubscription = api.subscription.delete.useMutation({
    onSuccess: () => {
      toast.success("Subscription deleted.");
      void utils.subscription.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete subscription.");
    },
  });

  const handleUpdateSubscription = api.subscription.update.useMutation({
    onSuccess: () => {
      toast.success("Subscription updated successfully.");
      setIsDialogOpen(false);
      setEditingSubscription(undefined);
      void utils.subscription.invalidate();
    },
    onError: () => {
      toast.error("Failed to update subscription.");
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

  const handleEdit = (
    subscription: RouterOutputs["subscription"]["getAll"][number],
  ) => {
    const baseSubscription = {
      id: subscription.id,
      name: subscription.name,
      price: subscription.latestPeriod.price,
      billingCycle: subscription.billingCycle,
      autoRenew: subscription.autoRenew,
      startDate: subscription.startDate,
    };

    const editData =
      subscription.latestPeriod?.isTrial && subscription.endDate
        ? {
            ...baseSubscription,
            isTrial: true as const,
            endDate: subscription.endDate,
          }
        : {
            ...baseSubscription,
            isTrial: false as const,
          };

    setEditingSubscription(editData);
    setIsDialogOpen(true);
  };

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
        {subscriptions && subscriptions.length === 0 ? (
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex h-full items-center justify-center">
                      <LoadingDots />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions?.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      {subscription.name}
                    </TableCell>
                    <TableCell>
                      {CURRENCY_SYMBOL}
                      {(Number(subscription.latestPeriod.price) / 100).toFixed(
                        2,
                      )}
                    </TableCell>
                    <TableCell>{subscription.billingCycle}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(subscription)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteSubscription.mutate({
                                id: subscription.id,
                              })
                            }
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        onClose={() => {
          setIsDialogOpen(false);
          setEditingSubscription(undefined);
        }}
        onAddSubscription={(subscription) =>
          handleAddSubscription.mutate(subscription)
        }
        onUpdateSubscription={(subscription) =>
          handleUpdateSubscription.mutate(subscription)
        }
        initialData={editingSubscription}
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
