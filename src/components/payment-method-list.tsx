"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  type PaymentMethodFormValues,
  paymentMethodFormSchema,
} from "@/lib/schema/paymentMethod";
import { api } from "@/trpc/react";
import type { PaymentMethod } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export function PaymentMethodList() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const utils = api.useUtils();

  const { data: paymentMethods, isLoading } = api.paymentMethod.getAll.useQuery();
  const { data: user } = api.user.getCurrent.useQuery();

  const isDefaultPaymentMethod = (paymentMethodId: string) => {
    return user?.defaultPaymentMethodId === paymentMethodId;
  };

  const { mutate: updatePaymentMethod } = api.paymentMethod.update.useMutation({
    onSuccess: () => {
      toast.success("Payment method updated successfully");
      setEditingId(null);
      void utils.user.getCurrent.invalidate();
      void utils.paymentMethod.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update payment method");
    },
  });

  const { mutate: deletePaymentMethod } = api.paymentMethod.delete.useMutation({
    onSuccess: () => {
      toast.success("Payment method removed successfully");
      void utils.paymentMethod.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove payment method");
    },
  });

  const { mutate: setAsDefault } = api.paymentMethod.setAsDefault.useMutation({
    onSuccess: () => {
      toast.success("Default payment method updated");
      void utils.paymentMethod.getAll.invalidate();
      void utils.user.getCurrent.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update default payment method");
    },
  });

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodFormSchema),
  });

  const handleEdit = (paymentMethod: PaymentMethod) => {
    form.reset({
      type: paymentMethod.type as "bank" | "card",
      name: paymentMethod.name,
      number: paymentMethod.number,
    });
    setEditingId(paymentMethod.id);
  };

  const handleSave = async (id: string, data: PaymentMethodFormValues) => {
    updatePaymentMethod({ id, data });
  };

  const handleDelete = async (id: string) => {
    deletePaymentMethod({ id });
  };

  if (isLoading) {
    return <div>Loading payment methods...</div>;
  }

  if (!paymentMethods?.length) {
    return <div>No payment methods found. Add a payment method above.</div>;
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((paymentMethod) => (
        <Card key={paymentMethod.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {paymentMethod.type === "bank" ? "Bank Account" : "Card"}
              {isDefaultPaymentMethod(paymentMethod.id) && (
                <Badge variant="secondary">Default</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingId === paymentMethod.id ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) =>
                    handleSave(paymentMethod.id, data),
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button type="submit">Save</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div>
                <p>
                  <strong>Name:</strong> {paymentMethod.name}
                </p>
                <p>
                  <strong>Number:</strong>{" "}
                  {"*".repeat(paymentMethod.number.length - 4) +
                    paymentMethod.number.slice(-4)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEdit(paymentMethod)}>
                Edit
              </Button>
              {!isDefaultPaymentMethod(paymentMethod.id) && (
                <Button
                  variant="outline"
                  onClick={() => setAsDefault({ id: paymentMethod.id })}
                >
                  Make Default
                </Button>
              )}
            </div>
            <Button
              variant="destructive"
              onClick={() => handleDelete(paymentMethod.id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
