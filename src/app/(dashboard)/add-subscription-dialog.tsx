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
import { ChevronDownIcon, Loader2, PlusCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { addDays } from "date-fns";
import { api } from "@/trpc/react";
import { AddPaymentMethodForm } from "@/components/add-payment-method-form";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface SubscriptionFormData {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  startDate: Date;
  paymentMethodId: string;
  isTrial: boolean;
}

type AddSubscriptionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSubscription: (
    subscription: InputType["subscription"]["create"],
  ) => void;
  onUpdateSubscription?: (
    subscription: InputType["subscription"]["update"],
  ) => void;
  initialData?: InputType["subscription"]["update"];
};

const mockServices = [
  {
    name: "Netflix",
    defaultCost: 15.99,
    defaultBillingCycle: "Monthly",
    isTrial: false,
    startDate: new Date(),
  },
  {
    name: "Spotify",
    defaultCost: 9.99,
    defaultBillingCycle: "Monthly",
    isTrial: false,
    startDate: new Date(),
  },
  {
    name: "Amazon Prime",
    defaultCost: 119,
    defaultBillingCycle: "Yearly",
    isTrial: false,
    startDate: new Date(),
  },
  {
    name: "Disney+",
    defaultCost: 7.99,
    defaultBillingCycle: "Monthly",
    isTrial: false,
    startDate: new Date(),
  },
  {
    name: "HBO Max",
    defaultCost: 14.99,
    defaultBillingCycle: "Monthly",
    isTrial: false,
    startDate: new Date(),
  },
  {
    name: "Apple Music",
    defaultCost: 9.99,
    defaultBillingCycle: "Monthly",
    isTrial: false,
    startDate: new Date(),
  },
  {
    name: "YouTube Premium",
    defaultCost: 11.99,
    defaultBillingCycle: "Monthly",
    isTrial: false,
    startDate: new Date(),
  },
  {
    name: "Hulu",
    defaultCost: 5.99,
    defaultBillingCycle: "Monthly",
    isTrial: false,
    startDate: new Date(),
  },
];

export function AddSubscriptionDialog({
  isOpen,
  onClose,
  onAddSubscription,
  onUpdateSubscription,
  initialData,
}: AddSubscriptionDialogProps) {
  const [newSubscription, setNewSubscription] = useState<
    InputType["subscription"]["create"]
  >({
    name: "",
    price: 0,
    autoRenew: true,
    isTrial: false as const,
    startDate: new Date(),
    billingCycle: "Monthly",
    paymentMethodId: null,
  });

  const [trialEndDate, setTrialEndDate] = useState<Date>(
    addDays(new Date(), 30),
  );

  const [searchResults, setSearchResults] = useState<typeof mockServices>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCustomService, setIsCustomService] = useState(false);
  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(true);
  const [formData, setFormData] = useState<Partial<SubscriptionFormData>>({});

  const { data: paymentMethods } = api.paymentMethod.getAll.useQuery();
  const { data: user } = api.user.getCurrent.useQuery();

  const form = useForm({
    defaultValues: {
      name: "",
      price: 0,
      billingCycle: "Monthly",
      startDate: new Date(),
      paymentMethodId: "",
      isTrial: false,
    }
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setNewSubscription({
        ...initialData,
        price: initialData.price / 100,
        paymentMethodId: initialData.paymentMethodId ?? null,
      });
      setUserInput(initialData.name);
      if (initialData.isTrial && initialData.endDate) {
        setTrialEndDate(initialData.endDate);
      }
    } else if (isOpen && user?.defaultPaymentMethodId) {
      setNewSubscription(prev => ({
        ...prev,
        paymentMethodId: user.defaultPaymentMethodId,
      }));
    }
  }, [initialData, isOpen, user?.defaultPaymentMethodId]);

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
    if (newSubscription.name && newSubscription.price > 0) {
      const subscriptionData = {
        ...newSubscription,
        price: newSubscription.price * 100,
        ...(newSubscription.isTrial && { endDate: trialEndDate }),
      };

      if (initialData?.id) {
        onUpdateSubscription?.({ ...subscriptionData, id: initialData.id });
      } else {
        onAddSubscription(subscriptionData);
      }

      setNewSubscription({
        name: "",
        price: 0,
        billingCycle: "Monthly",
        isTrial: false as const,
        startDate: new Date(),
        paymentMethodId: null,
      });
      setTrialEndDate(addDays(new Date(), 30));
      setUserInput("");
      setIsCustomService(false);
    } else {
      toast.error("Please fill in all fields correctly.");
    }
  };

  const handleServiceSelect = (service: (typeof mockServices)[0]) => {
    setNewSubscription({
      ...newSubscription,
      name: service.name,
      price: service.defaultCost,
      billingCycle: service.defaultBillingCycle as BillingCycle,
      isTrial: false as const,
      startDate: service.startDate,
    });
    setUserInput(service.name);
    setSearchResults([]);
    setIsPopoverOpen(false);
    setIsCustomService(false);
  };

  const handleCustomServiceToggle = () => {
    setIsCustomService(true);
    setIsPopoverOpen(false);
    setNewSubscription({
      ...newSubscription,
      name: "",
      price: 0,
    });
    setUserInput("");
  };

  const handleTrialToggle = (checked: boolean) => {
    if (checked) {
      setNewSubscription({
        ...newSubscription,
        isTrial: true as const,
        endDate: trialEndDate,
      });
    } else {
      setNewSubscription({
        ...newSubscription,
        isTrial: false as const,
      });
    }
  };

  const handlePaymentMethodAdded = (paymentMethodId: string) => {
    setShowPaymentMethodForm(false);
    setFormData(prev => ({
      ...prev,
      paymentMethodId
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {showPaymentMethodForm 
              ? "Add Payment Method" 
              : initialData ? "Edit Subscription" : "Add Subscription"}
          </DialogTitle>
        </DialogHeader>

        {showPaymentMethodForm ? (
          <AddPaymentMethodForm 
          />
        ) : (
          <Form {...form}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-6 items-start gap-4">
                <Label
                  htmlFor="subscription-name"
                  className="col-span-2 pt-2 text-right"
                >
                  Service Name
                </Label>
                <div className="col-span-4">
                  {isCustomService ? (
                    <Input
                      id="subscription-name"
                      value={newSubscription.name}
                      onChange={(e) =>
                        setNewSubscription({
                          ...newSubscription,
                          name: e.target.value,
                        })
                      }
                      className="w-full"
                      placeholder="Enter custom service name"
                    />
                  ) : (
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
                            <CommandGroup>
                              <CommandItem onSelect={handleCustomServiceToggle}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add custom service
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
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
                  value={newSubscription.price}
                  onChange={(e) =>
                    setNewSubscription({
                      ...newSubscription,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-4"
                  required
                />
              </div>
              <div className="grid grid-cols-6 items-center gap-4">
                <Label htmlFor="startDate" className="col-span-2 text-right">
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="col-span-4 w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newSubscription.startDate ? (
                        format(newSubscription.startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSubscription.startDate}
                      onSelect={(date) =>
                        setNewSubscription({
                          ...newSubscription,
                          startDate: date ?? new Date(),
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                    <SelectItem value="Biweekly">Biweekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-6 items-center gap-4">
                <Label htmlFor="isTrial" className="col-span-2 text-right">
                  Trial Period
                </Label>
                <div className="col-span-4">
                  <input
                    type="checkbox"
                    id="isTrial"
                    checked={newSubscription.isTrial}
                    onChange={(e) => handleTrialToggle(e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor="isTrial">This is a trial subscription</Label>
                </div>
              </div>

              {newSubscription.isTrial && (
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label htmlFor="trialEndDate" className="col-span-2 text-right">
                    Trial End Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="col-span-4 w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(trialEndDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={trialEndDate}
                        onSelect={(date) =>
                          setTrialEndDate(date ?? addDays(new Date(), 30))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              <div className="grid grid-cols-6 items-center gap-4">
                <Label htmlFor="paymentMethod" className="col-span-2 text-right">
                  Payment Method
                </Label>
                <Select
                  value={newSubscription.paymentMethodId ?? "none"}
                  onValueChange={(value) => {
                    if (value === "add_new") {
                      setShowPaymentMethodForm(true);
                    } else {
                      setNewSubscription({
                        ...newSubscription,
                        paymentMethodId: value === "none" ? null : value,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="col-span-4">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Payment Method</SelectItem>
                    <SelectItem value="add_new">
                      <div className="flex items-center">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Payment Method
                      </div>
                    </SelectItem>
                    {paymentMethods?.map((method) => (
                      <SelectItem 
                        key={method.id} 
                        value={method.id}
                      >
                        {method.name} {method.id === user?.defaultPaymentMethodId ? "(Default)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {initialData ? "Update Subscription" : "Add Subscription"}
              </Button>
            </DialogFooter>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
