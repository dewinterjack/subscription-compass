"use client";

import { useState } from "react";
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
import { api } from "@/trpc/react";
import { useDebounce } from "@/hooks/use-debounce";

type AddSubscriptionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  createSubscription: ReturnType<typeof api.subscription.create.useMutation>;
};

type Service = {
  id: string;
  name: string;
  defaultCost: number;
  defaultBillingCycle: BillingCycle;
};

export function AddSubscriptionDialog({
  isOpen,
  onClose,
  createSubscription,
}: AddSubscriptionDialogProps) {
  const [newSubscription, setNewSubscription] = useState<
    InputType["subscription"]["create"]
  >({
    service: { id: "" },
    cost: 0,
    billingCycle: "Monthly",
  });
  const [newServiceName, setNewServiceName] = useState("");

  const [userInput, setUserInput] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const debouncedUserInput = useDebounce(userInput, 300);

  const { data: searchResults, isFetching: isSearching } =
    api.service.search.useQuery(
      { query: debouncedUserInput },
      {
        enabled: debouncedUserInput.length > 0,
      },
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubscription.cost > 0) {
      const subscriptionData = {
        service: newSubscription.service.id
          ? { id: newSubscription.service.id }
          : {
              name: userInput,
              defaultCost: newSubscription.cost,
              defaultBillingCycle: newSubscription.billingCycle,
            },
        cost: newSubscription.cost,
        billingCycle: newSubscription.billingCycle,
      };
      createSubscription.mutate(subscriptionData, {
        onSuccess: () => {
          setUserInput("");
          setNewServiceName("");
          setNewSubscription({
            service: { id: "" },
            cost: 0,
            billingCycle: "Monthly",
          });
        },
      });
    } else {
      toast.error("Please fill in all fields correctly.");
    }
  };

  const handleServiceSelect = (service: Service) => {
    setNewSubscription({
      service,
      cost: service.defaultCost,
      billingCycle: service.defaultBillingCycle,
    });
    setUserInput(service.name);
    setIsPopoverOpen(false);
  };

  const handleSetNewServiceName = () => {
    setNewServiceName(userInput);
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
                      {newSubscription.service?.name ||
                        newServiceName ||
                        "Select a service..."}
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
                        <CommandGroup heading="Services">
                          {/* {userInput.trim() !== "" && (
                            <CommandItem onSelect={handleSetNewServiceName}>
                              Create new service: &quot;{userInput}&quot;
                            </CommandItem>
                          )} */}
                          {searchResults?.map((service) => (
                            <CommandItem
                              key={service.id}
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
            <Button type="submit" disabled={createSubscription.isPending}>
              {createSubscription.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Subscription"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
