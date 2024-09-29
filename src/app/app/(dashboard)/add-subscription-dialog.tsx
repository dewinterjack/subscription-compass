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

type Subscription = {
  name: string;
  cost: number;
  billingCycle: string;
};

type AddSubscriptionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSubscription: (subscription: Subscription) => void;
};

export function AddSubscriptionDialog({
  isOpen,
  onClose,
  onAddSubscription,
}: AddSubscriptionDialogProps) {
  const [newSubscription, setNewSubscription] = useState<Subscription>({
    name: "",
    cost: 0,
    billingCycle: "Monthly",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubscription.name && newSubscription.cost) {
      onAddSubscription(newSubscription);
      setNewSubscription({ name: "", cost: 0, billingCycle: "Monthly" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Enter the details of your new subscription here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newSubscription.name}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    name: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
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
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="billingCycle" className="text-right">
                Billing Cycle
              </Label>
              <Select
                value={newSubscription.billingCycle}
                onValueChange={(value) =>
                  setNewSubscription({
                    ...newSubscription,
                    billingCycle: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
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
