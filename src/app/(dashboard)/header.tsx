"use client";

import type { FormEvent } from "react";
import { Search, Sparkles, Bell } from "lucide-react";
import { api } from "@/trpc/react";
import type { Notification } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { UserButton } from "@clerk/nextjs";

export default function DashboardHeader() {
  const { data: notifications = [] } = api.notifications.getAll.useQuery<Notification[]>();
  const utils = api.useUtils();
  
  const { mutate: markAsRead } = api.notifications.markAsRead.useMutation({
    onSuccess: async () => {
      await utils.notifications.getAll.invalidate();
    },
  });

  const { mutate: markAllAsRead } = api.notifications.markAllAsRead.useMutation({
    onSuccess: async () => {
      await utils.notifications.getAll.invalidate();
    },
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.info("Not implemented yet");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
      <div className="flex w-full flex-1 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-primary text-primary-foreground hover:bg-accent-foreground hover:text-accent"
          onClick={() => toast.info("Not implemented yet")}
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
            {unreadCount > 0 && (
              <Badge
                className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full p-0"
                variant="destructive"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-2 py-1.5">
            <DropdownMenuLabel className="py-0">Notifications</DropdownMenuLabel>
            {notifications.some(n => !n.isRead) && (
              <Button
                variant="secondary"
                size="sm"
                className="h-6 rounded-sm px-2 text-xs font-normal"
                onClick={() => markAllAsRead()}
              >
                Mark all as read
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start"
            >
              <div className="font-semibold">{notification.title}</div>
              <div className="text-sm text-muted-foreground">
                {notification.description}
              </div>
              <div className="mt-1 flex w-full items-center justify-between gap-2 text-xs text-muted-foreground">
                <time dateTime={notification.createdAt.toISOString()}>
                  {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                    -Math.round((Date.now() - new Date(notification.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
                    'day'
                  )}
                </time>
                {!notification.isRead && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => markAsRead({ id: notification.id })}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          {notifications.length === 0 && (
            <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <UserButton />
    </header>
  );
}
