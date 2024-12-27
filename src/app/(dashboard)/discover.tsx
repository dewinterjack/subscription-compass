"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { api } from "@/trpc/react";
import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Discover = () => {
  const { data, isLoading } = api.subscription.getAll.useQuery();
  const subscriptions = data ?? [];

  const [open, setOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<
    string | null
  >(null);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Discover Alternatives</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedSubscription ?? "Select subscription..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search subscription..." />
            <CommandEmpty>
              No subscription found.
              <br />
              <Link href="/subscriptions" className="text-blue-500">
                Create a new one.
              </Link>
            </CommandEmpty>
            <CommandGroup>
              <CommandList>
                {subscriptions.map((subscription) => (
                  <CommandItem
                    key={subscription.id}
                    value={subscription.name}
                    onSelect={(value) => {
                      setSelectedSubscription(
                        value === selectedSubscription ? null : value,
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSubscription === subscription.name
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {subscription.name}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedSubscription && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Selected Subscription:</h2>
          <p>{selectedSubscription}</p>
        </div>
      )}
    </div>
  );
};

export default Discover;
