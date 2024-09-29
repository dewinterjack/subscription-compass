"use client";

import { useState } from "react";
import type { FormEvent } from "react";
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
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const showNotImplementedToast = () => {
    toast.info("This feature is not yet implemented.");
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showNotImplementedToast();
  };

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
        <div className="flex items-center justify-between p-4">
          {isSidebarExpanded ? (
            <>
              <Link href="#" className="text-lg font-semibold">
                SubsCompass
              </Link>
              <Button variant="ghost" size="icon" onClick={handleToggleSidebar}>
                <ChevronsLeft className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              className="mx-auto"
            >
              <ChevronsRight className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
        </div>
        <nav className="flex-1 space-y-2 px-2 py-4">
          <TooltipProvider>
            {[
              { icon: Home, label: "Dashboard", href: "#" },
              {
                icon: Package,
                label: "Subscriptions",
                href: "#",
                badge: subscriptions.length,
              },
              { icon: LineChart, label: "Analytics", href: "#" },
              { icon: Zap, label: "Discover", href: "#" },
            ].map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                    onClick={showNotImplementedToast}
                  >
                    <item.icon
                      className={clsx("min-h-5 min-w-5 transition-all")}
                    />
                    {isSidebarExpanded && (
                      <>
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge className="ml-auto flex h-5 w-5 items-center justify-center rounded-full">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                {!isSidebarExpanded && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
        <div className="p-4">
          <Card>
            {isSidebarExpanded && (
              <>
                <CardHeader>
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>Unlock all pro features</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={showNotImplementedToast}
                  >
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
          <div className="flex w-full flex-1 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-primary text-primary-foreground hover:bg-accent-foreground hover:text-accent"
              onClick={showNotImplementedToast}
            >
              <Sparkles className="h-5 w-5 transition-all hover:scale-110" />
            </Button>
            <form className="flex-1" onSubmit={handleSearch}>
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
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={showNotImplementedToast}
          >
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
              <DropdownMenuItem onClick={showNotImplementedToast}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={showNotImplementedToast}>
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={showNotImplementedToast}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <SignOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 3xl:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                  <Button variant="outline" onClick={showNotImplementedToast}>
                    View All
                  </Button>
                  <Button variant="outline" onClick={showNotImplementedToast}>
                    Export
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={showNotImplementedToast}
                      >
                        {opportunity.action}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={showNotImplementedToast}
                      >
                        {alert.action}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
              <DialogDescription>
                Enter the details of your new subscription here.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubscription}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newSubscription.name}
                    onChange={(e) =>
                      setNewSubscription({
                        ...newSubscription,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cost" className="text-right">
                    Cost
                  </Label>
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
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="billingCycle" className="text-right">
                    Billing Cycle
                  </Label>
                  <Select
                    value={newSubscription.billingCycle}
                    onValueChange={(value) =>
                      setNewSubscription({
                        ...newSubscription,
                        billingCycle: value,
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Subscription</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
