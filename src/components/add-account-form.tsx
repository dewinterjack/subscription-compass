"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  type AccountFormValues,
  accountFormSchema,
} from "@/lib/schema/account";
import { api } from "@/trpc/react";
import type { Account } from "@prisma/client";

export function AddAccountForm() {
  const router = useRouter();
  const utils = api.useUtils();

  const { mutate: createAccount, isPending } =
    api.account.create.useMutation<Account>({
      onSuccess: (data) => {
        toast.success(
          `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} account "${data.name}" has been added.`,
        );
        form.reset();
        router.refresh();
        // Invalidate the accounts query to refetch the list
        void utils.account.getAll.invalidate();
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to add account. Please try again.",
        );
      },
    });

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      type: "bank" as const,
      name: "",
      number: "",
    },
  });

  const onSubmit = (data: AccountFormValues) => {
    createAccount(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Bank Account</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Card</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
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
              <FormLabel>
                {form.watch("type") === "bank"
                  ? "Account Number"
                  : "Card Number"}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Account"}
        </Button>
      </form>
    </Form>
  );
}
