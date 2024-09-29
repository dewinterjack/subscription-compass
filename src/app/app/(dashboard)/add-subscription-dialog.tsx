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

type AddSubscriptionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSubscription: (
    subscription: InputType["subscription"]["create"],
  ) => void;
};

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubscription.name && newSubscription.cost > 0) {
      onAddSubscription(newSubscription);
      setNewSubscription({ name: "", cost: 0, billingCycle: "Monthly" });
      toast.success("Subscription added successfully.");
    } else {
      toast.error("Please fill in all fields correctly.");
    }
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
            <div className="grid grid-cols-6 items-center gap-4">
              <Label
                htmlFor="subscription-name"
                className="col-span-2 text-right"
              >
                Service Name
              </Label>
              <Input
                id="subscription-name"
                autoComplete="off"
                value={newSubscription.name}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    name: e.target.value,
                  })
                }
                className="col-span-4"
                required
              />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="cost" className="col-span-2 text-right">
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
