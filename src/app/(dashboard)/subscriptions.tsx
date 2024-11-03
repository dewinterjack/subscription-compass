"use client";

import { useState } from "react";
import { Plus, ShoppingBasket, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProPlanModal from "./pro-plan-modal";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function SubscriptionsSection() {
  const isXLScreen = useMediaQuery("(min-width: 1280px)");
  const isLgScreen = useMediaQuery("(min-width: 1024px)");
  const isMdScreen = useMediaQuery("(min-width: 768px)");

  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const { data: subscriptions, refetch } = api.subscription.getAll.useQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const getVisibleItems = () => {
    if (isXLScreen) return 8;
    if (isLgScreen) return 6;
    if (isMdScreen) return 4;
    return 3;
  };

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

  const handleDeleteSubscription = api.subscription.delete.useMutation({
    onSuccess: () => {
      toast.success("Subscription deleted.");
      void refetch();
    },
    onError: () => {
      toast.error("Failed to delete subscription.");
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Subscriptions</CardTitle>
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
              {subscriptions
                ?.slice(0, getVisibleItems())
                .map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      {subscription.name}
                    </TableCell>
                    <TableCell>
                      {CURRENCY_SYMBOL}
                      {(subscription.cost / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>{subscription.billingCycle}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleDeleteSubscription.mutate({
                            id: subscription.id,
                          })
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={() => router.push("/subscriptions")}>
          View All
        </Button>
      </CardFooter>
      <AddSubscriptionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddSubscription={(subscription) =>
          handleAddSubscription.mutate(subscription)
        }
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
