"use client";

import { useState } from "react";
import {
  Plus,
  ShoppingBasket,
  MoreHorizontal,
  Building,
  CreditCard,
  ChevronUp,
  ChevronDown,
  Filter,
  Check,
} from "lucide-react";
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
import LoadingDots from "@/components/icons/loading-dots";
import type { SubscriptionWithLatestPeriod } from "@/types";
import type { InputType } from "@/server/api/root";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type SortField = "name" | "price" | "paymentMethod" | "billingCycle";
type SortDirection = "asc" | "desc";

interface FilterState {
  paymentMethods: Set<string | null>;
  subscriptionType: "all" | "trial" | "non-trial";
}

export function SubscriptionsSection() {
  const { data: subscriptions, isLoading } = api.subscription.getAll.useQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<
    InputType["subscription"]["update"] | undefined
  >();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState<FilterState>({
    paymentMethods: new Set(),
    subscriptionType: "all",
  });

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

  const handleEdit = (subscription: SubscriptionWithLatestPeriod) => {
    if (!subscription.latestPeriod) {
      toast.error("Cannot edit subscription without period information");
      return;
    }

    const baseSubscription = {
      id: subscription.id,
      name: subscription.name,
      price: subscription.latestPeriod.price,
      billingCycle: subscription.billingCycle,
      autoRenew: subscription.autoRenew,
      startDate: subscription.startDate,
      paymentMethodId: subscription.paymentMethodId,
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

  const getSortedSubscriptions = (
    subscriptions: SubscriptionWithLatestPeriod[],
  ) => {
    if (!subscriptions) return [];

    return [...subscriptions].sort((a, b) => {
      let compareA, compareB;

      switch (sortField) {
        case "name":
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          break;
        case "price":
          compareA = Number(a.latestPeriod?.price ?? 0);
          compareB = Number(b.latestPeriod?.price ?? 0);
          break;
        case "paymentMethod":
          compareA = a.paymentMethod?.name?.toLowerCase() ?? "";
          compareB = b.paymentMethod?.name?.toLowerCase() ?? "";
          break;
        case "billingCycle":
          compareA = a.billingCycle.toLowerCase();
          compareB = b.billingCycle.toLowerCase();
          break;
        default:
          return 0;
      }

      const sortResult = compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      return sortDirection === "asc" ? sortResult : -sortResult;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getFilteredAndSortedSubscriptions = (
    subscriptions: SubscriptionWithLatestPeriod[],
  ) => {
    if (!subscriptions) return [];

    const filtered = subscriptions.filter((sub) => {
      const paymentMethodMatch =
        filters.paymentMethods.size === 0 ||
        filters.paymentMethods.has(sub.paymentMethod?.name ?? null);

      const subscriptionTypeMatch =
        filters.subscriptionType === "all" ||
        (filters.subscriptionType === "trial" && sub.latestPeriod?.isTrial) ||
        (filters.subscriptionType === "non-trial" &&
          !sub.latestPeriod?.isTrial);

      return paymentMethodMatch && subscriptionTypeMatch;
    });

    return getSortedSubscriptions(filtered);
  };

  const getUniquePaymentMethods = (
    subscriptions: SubscriptionWithLatestPeriod[],
  ) => {
    const methods = new Set<string>();
    subscriptions?.forEach((sub) => {
      if (sub.paymentMethod?.name) {
        methods.add(sub.paymentMethod.name);
      }
    });
    return Array.from(methods);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="text-2xl">Your Subscriptions</CardTitle>
          <CardDescription>
            Manage and track your active subscriptions
          </CardDescription>
        </div>
        <div className="flex w-full flex-col space-y-2 sm:w-auto sm:flex-row sm:space-x-2 sm:space-y-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {(filters.paymentMethods.size > 0 ||
                  filters.subscriptionType !== "all") && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.paymentMethods.size +
                      (filters.subscriptionType !== "all" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
              <div className="p-2">
                <h4 className="mb-2 text-sm font-medium">Payment Methods</h4>
                <div className="space-y-2">
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        paymentMethods: new Set(
                          prev.paymentMethods.has(null)
                            ? Array.from(prev.paymentMethods).filter(
                                (m) => m !== null,
                              )
                            : [...prev.paymentMethods, null],
                        ),
                      }));
                    }}
                  >
                    No Payment Method
                    {filters.paymentMethods.has(null) && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  {subscriptions &&
                    getUniquePaymentMethods(subscriptions).map((method) => (
                      <DropdownMenuItem
                        key={method}
                        className="flex items-center justify-between"
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            paymentMethods: new Set(
                              prev.paymentMethods.has(method)
                                ? Array.from(prev.paymentMethods).filter(
                                    (m) => m !== method,
                                  )
                                : [...prev.paymentMethods, method],
                            ),
                          }));
                        }}
                      >
                        {method}
                        {filters.paymentMethods.has(method) && (
                          <Check className="h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <h4 className="mb-2 text-sm font-medium">Subscription Type</h4>
                <div className="space-y-2">
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        subscriptionType: "all",
                      }))
                    }
                  >
                    All Subscriptions
                    {filters.subscriptionType === "all" && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        subscriptionType: "trial",
                      }))
                    }
                  >
                    Trial Subscriptions
                    {filters.subscriptionType === "trial" && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        subscriptionType: "non-trial",
                      }))
                    }
                  >
                    Non-Trial Subscriptions
                    {filters.subscriptionType === "non-trial" && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center justify-between text-destructive"
                onClick={() => {
                  setFilters({
                    paymentMethods: new Set(),
                    subscriptionType: "all",
                  });
                }}
              >
                Clear all filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="w-full sm:w-auto"
          >
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
                <TableHead
                  className="w-[200px] cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center">
                    Cost
                    {sortField === "price" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("paymentMethod")}
                >
                  <div className="flex items-center">
                    Payment Method
                    {sortField === "paymentMethod" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("billingCycle")}
                >
                  <div className="flex items-center">
                    Billing Cycle
                    {sortField === "billingCycle" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
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
                subscriptions &&
                subscriptions.length > 0 &&
                getFilteredAndSortedSubscriptions(subscriptions).map(
                  (subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {subscription.name}
                          {subscription.latestPeriod?.isTrial && (
                            <Badge variant="secondary">Trial</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {CURRENCY_SYMBOL}
                        {(
                          Number(subscription.latestPeriod?.price ?? 0) / 100
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {subscription.paymentMethod ? (
                          <div className="flex items-center gap-2">
                            {subscription.paymentMethod.type === "bank" ? (
                              <Building className="h-4 w-4" />
                            ) : (
                              <CreditCard className="h-4 w-4" />
                            )}
                            <span>{subscription.paymentMethod.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No payment method
                          </span>
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
                  ),
                )
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
    </Card>
  );
}
