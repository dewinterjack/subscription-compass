"use client";

import type { FormEvent } from "react";
import Image from "next/image";
import { Search, Sparkles, Bell } from "lucide-react";

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
import { SignOutButton } from "./sign-out-button";
import { toast } from "sonner";

type HeaderProps = {
  user: {
    image?: string | null;
  };
};

export function DashboardHeader({ user }: HeaderProps) {
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.info("Not implemented yet");
  };

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
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => toast.info("Not implemented yet")}
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
          <DropdownMenuItem onClick={() => toast.info("Not implemented yet")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info("Not implemented yet")}>
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info("Not implemented yet")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
