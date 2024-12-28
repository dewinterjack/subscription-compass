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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";

interface SubscriptionFormData {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  startDate: Date;
  paymentMethodId: string | null;
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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  billingCycle: z.enum(["Weekly", "Biweekly", "Monthly", "Yearly"]),
  startDate: z.date(),
  paymentMethodId: z.string().nullable(),
  isTrial: z.boolean(),
});

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
  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
  const [formData, setFormData] = useState<Partial<SubscriptionFormData>>({});

  const { data: paymentMethods } = api.paymentMethod.getAll.useQuery();
  const { data: user } = api.user.getCurrent.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      price: initialData ? initialData.price / 100 : 0,
      billingCycle: initialData?.billingCycle ?? "Monthly",
      startDate: initialData?.startDate ?? new Date(),
      paymentMethodId: initialData?.paymentMethodId ?? null,
      isTrial: initialData?.isTrial ?? false,
    },
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
      setNewSubscription((prev) => ({
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

  useEffect(() => {
    if (isOpen && user?.defaultPaymentMethodId) {
      form.setValue("paymentMethodId", user.defaultPaymentMethodId);
    }
  }, [isOpen, user?.defaultPaymentMethodId, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const subscriptionData = {
      ...data,
      price: data.price * 100,
      autoRenew: true,
      ...(data.isTrial && { endDate: trialEndDate }),
      paymentMethodId:
        data.paymentMethodId === "none" ? null : data.paymentMethodId,
    };

    if (initialData?.id) {
      onUpdateSubscription?.({ ...subscriptionData, id: initialData.id });
    } else {
      onAddSubscription(subscriptionData);
    }

    form.reset();
    setTrialEndDate(addDays(new Date(), 30));
    setUserInput("");
    setIsCustomService(false);
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
    form.setValue("paymentMethodId", paymentMethodId);
  };

  const handlePaymentMethodChange = (value: string) => {
    if (value === "add_new") {
      setShowPaymentMethodForm(true);
    } else {
      form.setValue("paymentMethodId", value);
    }
  };

  const closeDialog = () => {
    onClose();
    setTimeout(() => setShowPaymentMethodForm(false), 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <div className="relative flex h-6 items-center justify-center">
            {showPaymentMethodForm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPaymentMethodForm(false)}
                className="absolute left-0 h-6 px-1.5 text-xs"
              >
                <ChevronDownIcon className="mr-1 h-2.5 w-2.5 rotate-90" />
                Back
              </Button>
            )}
            <DialogTitle className="text-base">
              {showPaymentMethodForm
                ? "Add Payment Method"
                : initialData
                  ? "Edit Subscription"
                  : "Add Subscription"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {showPaymentMethodForm ? (
          <AddPaymentMethodForm onSuccess={handlePaymentMethodAdded} />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      {isCustomService ? (
                        <Input
                          {...field}
                          placeholder="Enter custom service name"
                        />
                      ) : (
                        <Popover
                          open={isPopoverOpen}
                          onOpenChange={setIsPopoverOpen}
                        >
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
                                {...form.register("name")}
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
                                      onSelect={() =>
                                        handleServiceSelect(service)
                                      }
                                    >
                                      {service.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={handleCustomServiceToggle}
                                  >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add custom service
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingCycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select billing cycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Biweekly">Biweekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTrial"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Trial Period</FormLabel>
                      <FormDescription>
                        This is a trial subscription
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("isTrial") && (
                <FormField
                  control={form.control}
                  name="trialEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trial End Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="paymentMethodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        handlePaymentMethodChange(value);
                        field.onChange(value);
                      }}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Payment Method</SelectItem>
                        <SelectItem value="add_new">
                          <div className="flex items-center">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Payment Method
                          </div>
                        </SelectItem>
                        {paymentMethods?.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.name}{" "}
                            {method.id === user?.defaultPaymentMethodId
                              ? "(Default)"
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {initialData ? "Update Subscription" : "Add Subscription"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
