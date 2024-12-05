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
  type AccountFormValues,
  accountFormSchema,
} from "@/lib/schema/account";
import { api } from "@/trpc/react";
import type { Account } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export function AccountsList() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const utils = api.useUtils();

  const { data: accounts, isLoading } = api.account.getAll.useQuery();
  const { data: user } = api.user.getCurrent.useQuery();

  const isDefaultAccount = (accountId: string) => {
    return user?.defaultPaymentMethodId === accountId;
  };

  const { mutate: updateAccount } = api.account.update.useMutation({
    onSuccess: () => {
      toast.success("Account updated successfully");
      setEditingId(null);
      void utils.user.getCurrent.invalidate();
      void utils.account.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update account");
    },
  });

  const { mutate: deleteAccount } = api.account.delete.useMutation({
    onSuccess: () => {
      toast.success("Account removed successfully");
      void utils.account.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove account");
    },
  });

  const { mutate: setAsDefault } = api.account.setAsDefault.useMutation({
    onSuccess: () => {
      toast.success("Default payment method updated");
      void utils.account.getAll.invalidate();
      void utils.user.getCurrent.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update default payment method");
    },
  });

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
  });

  const handleEdit = (account: Account) => {
    form.reset({
      type: account.type as "bank" | "card",
      name: account.name,
      number: account.number,
    });
    setEditingId(account.id);
  };

  const handleSave = async (id: string, data: AccountFormValues) => {
    updateAccount({ id, data });
  };

  const handleDelete = async (id: string) => {
    deleteAccount({ id });
  };

  if (isLoading) {
    return <div>Loading accounts...</div>;
  }

  if (!accounts?.length) {
    return <div>No accounts found. Add your first account above.</div>;
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {account.type === "bank" ? "Bank Account" : "Card"}
              {isDefaultAccount(account.id) && (
                <Badge variant="secondary">Default</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingId === account.id ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) =>
                    handleSave(account.id, data),
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
                  <strong>Name:</strong> {account.name}
                </p>
                <p>
                  <strong>Number:</strong>{" "}
                  {"*".repeat(account.number.length - 4) +
                    account.number.slice(-4)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEdit(account)}>
                Edit
              </Button>
              {!isDefaultAccount(account.id) && (
                <Button
                  variant="outline"
                  onClick={() => setAsDefault({ id: account.id })}
                >
                  Make Default
                </Button>
              )}
            </div>
            <Button
              variant="destructive"
              onClick={() => handleDelete(account.id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
