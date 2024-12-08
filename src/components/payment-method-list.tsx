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
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  type PaymentMethodFormValues,
  paymentMethodFormSchema,
} from "@/lib/schema/paymentMethod";
import { api } from "@/trpc/react";
import type { PaymentMethod } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import LoadingDots from "./icons/loading-dots";
import { format } from "date-fns";

export function PaymentMethodList() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const utils = api.useUtils();

  const { data: paymentMethods, isLoading } =
    api.paymentMethod.getAll.useQuery();
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
      void utils.user.getCurrent.invalidate();
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
    const expiryDate = paymentMethod.expiresAt
      ? new Date(paymentMethod.expiresAt)
      : null;

    form.reset({
      name: paymentMethod.name,
      expiryMonth: expiryDate ? String(expiryDate.getMonth() + 1).padStart(2, '0') : '',
      expiryYear: expiryDate ? String(expiryDate.getFullYear()) : '',
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
    return <LoadingDots />;
  }

  if (!paymentMethods?.length) {
    return <div>No payment methods found. Add a payment method above.</div>;
  }

  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-background dark:border-gray-700">
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
                    {paymentMethod.type === "card" && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="expiryMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Month (MM)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="MM"
                                  maxLength={2}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="expiryYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Year (YYYY)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="YYYY"
                                  maxLength={4}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
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
                  <p><strong>Name:</strong> {paymentMethod.name}</p>
                  {paymentMethod.type === "card" && paymentMethod.expiresAt && (
                    <p>
                      <strong>Expires:</strong>{" "}
                      {format(paymentMethod.expiresAt, "MM/yyyy")}
                    </p>
                  )}
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
    </div>
  );
}
