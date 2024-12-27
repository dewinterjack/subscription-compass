"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBasket,
  CreditCard,
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
import { api } from "@/trpc/react";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardSidebar() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const pathname = usePathname();
  const { data: subscriptionCount } = api.subscription.count.useQuery();

  const handleToggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside
      className={clsx(
        "sticky top-0 flex h-screen flex-col border-r bg-background transition-all duration-300",
        {
          "w-64": isSidebarExpanded,
          "w-14": !isSidebarExpanded,
        },
      )}
    >
      <div className="flex items-center justify-between p-4">
        {isSidebarExpanded ? (
          <>
            <Link href="/dashboard" className="text-lg font-semibold">
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
            { icon: Home, label: "Home", href: "/dashboard" },
            {
              icon: ShoppingBasket,
              label: "Subscriptions",
              href: "/subscriptions",
              badge: subscriptionCount,
            },
            {
              icon: CreditCard,
              label: "Payment Methods",
              href: "/payment-methods",
            },
            { icon: Zap, label: "Discover", href: "/discover" },
          ].map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-primary",
                  )}
                >
                  <item.icon
                    className={clsx(
                      // needs both max and min height and width otherwise expand and collapse looks odd
                      "max-h-5 min-h-5 min-w-5 max-w-5 transition-colors",
                      isActive(item.href) ? "text-primary" : "",
                    )}
                  />
                  {isSidebarExpanded && (
                    <>
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
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
      <div className="mt-4 flex justify-center">
        <ThemeToggle />
      </div>
    </aside>
  );
}
