"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  Bell,
  CreditCard,
  DollarSign,
  Home,
  LineChart,
  Package,
  Plus,
  Search,
  Sparkles,
  Zap,
  Menu,
} from "lucide-react";

import clsx from "clsx";

import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { SignOutButton } from "./sign-out-button";

import type { User } from "next-auth";

export default function Dashboard({ user }: { user: User }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: "",
    cost: "",
    billingCycle: "Monthly",
  });

  const handleToggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubscription.name && newSubscription.cost) {
      setSubscriptions([
        //@ts-expect-error temp
        ...subscriptions,
        //@ts-expect-error temp
        { ...newSubscription, cost: parseFloat(newSubscription.cost) },
      ]);
      setNewSubscription({ name: "", cost: "", billingCycle: "Monthly" });
      setIsDialogOpen(false);
    }
  };

  const totalMonthlyCost = subscriptions.reduce(
    //@ts-expect-error temp
    //eslint-disable-next-line
    (total, sub) => total + sub.cost,
    0,
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-10 flex flex-col border-r bg-background duration-300",
          {
            "w-64": isSidebarExpanded,
            "w-14": !isSidebarExpanded,
          },
        )}
      >
        <div className="flex flex-col items-center p-4">
          {isSidebarExpanded && (
            <Link href="#" className="mb-4 text-lg font-semibold">
              SubsCompass
            </Link>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleSidebar}
            className="mb-4"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="mb-4 rounded-full bg-black text-white hover:bg-gray-800"
          >
            <Sparkles className="h-5 w-5" />
            <span className="sr-only">SubsCompass</span>
          </Button>
        </div>
        <nav className="flex-1 space-y-2 px-2 py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary hover:text-primary"
                >
                  <Home className="h-5 w-5" />
                  {isSidebarExpanded && <span>Dashboard</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                >
                  <Package className="h-5 w-5" />
                  {isSidebarExpanded && (
                    <>
                      <span>Subscriptions</span>
                      <Badge className="ml-auto flex h-5 w-5 items-center justify-center rounded-full">
                        {subscriptions.length}
                      </Badge>
                    </>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Subscriptions</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                >
                  <LineChart className="h-5 w-5" />
                  {isSidebarExpanded && <span>Analytics</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                >
                  <Zap className="h-5 w-5" />
                  {isSidebarExpanded && <span>Discover</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Discover</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <div className="p-4">
          <Card>
            {isSidebarExpanded && (
              <>
                <CardHeader>
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>
                    Unlock all features and get unlimited access to our support
                    team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </aside>
      <div
        className={clsx(
          "flex flex-1 flex-col transition-[margin-left] duration-300",
          {
            "ml-64": isSidebarExpanded,
            "ml-14": !isSidebarExpanded,
          },
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search subscriptions..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
            <Badge
              className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0"
              variant="destructive"
            >
              3
            </Badge>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src={user.image ?? "/placeholder-user.jpg"}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <SignOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <div className="3xl:grid-cols-[2fr,1fr] grid gap-4">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Total Subscriptions Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Subscriptions</CardDescription>
                    <CardTitle className="text-4xl">
                      {subscriptions.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      +2 new this month
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Spend Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Monthly Spend</CardDescription>
                    <CardTitle className="text-4xl">
                      ${totalMonthlyCost.toFixed(2)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      -$50 from last month
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Progress value={65} aria-label="65% of budget" />
                  </CardFooter>
                </Card>

                {/* Potential Savings Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Potential Savings</CardDescription>
                    <CardTitle className="text-4xl">$75</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Based on 3 recommendations
                    </div>
                  </CardContent>
                </Card>

                {/* Placeholder Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Placeholder</CardDescription>
                    <CardTitle className="text-4xl">3</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Next 7 days
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Subscriptions</CardTitle>
                    <CardDescription>
                      Manage and track your active subscriptions
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  {subscriptions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-3 py-12">
                      <div className="rounded-full bg-muted p-3">
                        <Package className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold">
                        No subscriptions yet
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You haven&apos;t added any subscriptions. Add one to get
                        started.
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
                        {subscriptions.map((subscription, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {/*@ts-expect-error temp*/}
                              {subscription.name}
                            </TableCell>
                            <TableCell>$10</TableCell>
                            <TableCell>
                              {/*@ts-expect-error temp*/}
                              {subscription.billingCycle}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost">Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View All</Button>
                  <Button variant="outline">Export</Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
              {/* Upcoming Renewals Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Renewals</CardTitle>
                  <CardDescription>Next 7 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Netflix", renewsIn: 2, cost: 19.99 },
                    { name: "Spotify", renewsIn: 5, cost: 14.99 },
                    { name: "GitHub", renewsIn: 7, cost: 4.0 },
                  ].map((sub, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{sub.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Renews in {sub.renewsIn} days
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        ${sub.cost.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Savings Opportunities Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Savings Opportunities</CardTitle>
                  <CardDescription>Optimize your subscriptions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "Switch to Annual Plan",
                      description: "Save $24/year on Spotify",
                      action: "Apply",
                    },
                    {
                      title: "Student Discount Available",
                      description: "Save 50% on Adobe CC",
                      action: "Verify",
                    },
                    {
                      title: "Bundle Opportunity",
                      description: "Save $5/month on streaming",
                      action: "View",
                    },
                  ].map((opportunity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{opportunity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {opportunity.description}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {opportunity.action}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Alerts Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Alerts</CardTitle>
                  <CardDescription>
                    Stay informed about your subscriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "Price Increase",
                      description: "Netflix raising prices next month",
                      action: "Review",
                    },
                    {
                      title: "Trial Ending Soon",
                      description: "3 days left on your Audible trial",
                      action: "Manage",
                    },
                  ].map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {alert.description}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {alert.action}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        {/* Add Subscription Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold">
                Add New Subscription
              </h2>
              <form onSubmit={handleAddSubscription}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    value={newSubscription.name}
                    onChange={(e) =>
                      setNewSubscription({
                        ...newSubscription,
                        name: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="cost"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cost
                  </label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={newSubscription.cost}
                    onChange={(e) =>
                      setNewSubscription({
                        ...newSubscription,
                        cost: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="billingCycle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Billing Cycle
                  </label>
                  <select
                    id="billingCycle"
                    value={newSubscription.billingCycle}
                    onChange={(e) =>
                      setNewSubscription({
                        ...newSubscription,
                        billingCycle: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Subscription</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
