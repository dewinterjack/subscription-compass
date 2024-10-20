"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { InputType } from "@/server/api/root";
import type { BillingCycle } from "@prisma/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CommandLoading } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, Loader2 } from "lucide-react";

type AddSubscriptionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSubscription: (
    subscription: InputType["subscription"]["create"],
  ) => void;
};

const mockServices = [
  { name: "Netflix", defaultCost: 15.99, defaultBillingCycle: "Monthly" },
  { name: "Spotify", defaultCost: 9.99, defaultBillingCycle: "Monthly" },
  { name: "Amazon Prime", defaultCost: 119, defaultBillingCycle: "Yearly" },
  { name: "Disney+", defaultCost: 7.99, defaultBillingCycle: "Monthly" },
  { name: "HBO Max", defaultCost: 14.99, defaultBillingCycle: "Monthly" },
  { name: "Apple Music", defaultCost: 9.99, defaultBillingCycle: "Monthly" },
  {
    name: "YouTube Premium",
    defaultCost: 11.99,
    defaultBillingCycle: "Monthly",
  },
  { name: "Hulu", defaultCost: 5.99, defaultBillingCycle: "Monthly" },
];

export function AddSubscriptionDialog({
  isOpen,
  onClose,
  onAddSubscription,
}: AddSubscriptionDialogProps) {
  const [newSubscription, setNewSubscription] = useState<
    InputType["subscription"]["create"]
  >({
    name: "",
    cost: 0,
    billingCycle: "Monthly",
  });

  const [searchResults, setSearchResults] = useState<typeof mockServices>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (userInput) {
      setIsSearching(true);
      // Simulate API call delay
      const timeoutId = setTimeout(() => {
        const results = mockServices.filter((service) =>
          service.name.toLowerCase().includes(userInput.toLowerCase()),
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [userInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubscription.name && newSubscription.cost > 0) {
      onAddSubscription(newSubscription);
      setNewSubscription({ name: "", cost: 0, billingCycle: "Monthly" });
      setUserInput("");
      toast.success("Subscription added successfully.");
    } else {
      toast.error("Please fill in all fields correctly.");
    }
  };

  const handleServiceSelect = (service: (typeof mockServices)[0]) => {
    setNewSubscription({
      name: service.name,
      cost: service.defaultCost,
      billingCycle: service.defaultBillingCycle as BillingCycle,
    });
    setUserInput(service.name);
    setSearchResults([]);
    setIsPopoverOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Enter the details of your new subscription here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-6 items-start gap-4">
              <Label
                htmlFor="subscription-name"
                className="col-span-2 pt-2 text-right"
              >
                Service Name
              </Label>
              <div className="col-span-4">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isPopoverOpen}
                      className="w-full justify-between"
                    >
                      {newSubscription.name || "Select a service..."}
                      <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search for a service..."
                        value={userInput}
                        onValueChange={setUserInput}
                      />
                      <CommandList>
                        {isSearching && (
                          <CommandLoading>
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          </CommandLoading>
                        )}
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Services">
                          {searchResults.map((service) => (
                            <CommandItem
                              key={service.name}
                              onSelect={() => handleServiceSelect(service)}
                            >
                              {service.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="cost" className="col-span-2 text-right">
                Cost
              </Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={newSubscription.cost}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    cost: parseFloat(e.target.value),
                  })
                }
                className="col-span-4"
                required
              />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="billingCycle" className="col-span-2 text-right">
                Billing Cycle
              </Label>
              <Select
                value={newSubscription.billingCycle}
                onValueChange={(value) =>
                  setNewSubscription({
                    ...newSubscription,
                    billingCycle: value as BillingCycle,
                  })
                }
              >
                <SelectTrigger className="col-span-4">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
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
  );
}
