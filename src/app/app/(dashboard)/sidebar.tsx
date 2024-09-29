"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Home,
  ShoppingBasket,
  LineChart,
  Zap,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

type SidebarProps = {
  subscriptions: Array<{ cost: number }>;
};

export function DashboardSidebar({ subscriptions }: SidebarProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <aside
      className={clsx(
        "flex flex-col border-r bg-background transition-all duration-300",
        {
          "w-64": isSidebarExpanded,
          "w-14": !isSidebarExpanded,
        },
      )}
    >
      <div className="flex items-center justify-between p-4">
        {isSidebarExpanded ? (
          <>
            <Link href="/" className="text-lg font-semibold">
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
            { icon: Home, label: "Dashboard", href: "/" },
            {
              icon: ShoppingBasket,
              label: "Subscriptions",
              href: "/subscriptions",
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
                  onClick={() => {
                    toast.info("This feature is not yet implemented.");
                  }}
                >
                  Upgrade
                </Button>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </aside>
  );
}
