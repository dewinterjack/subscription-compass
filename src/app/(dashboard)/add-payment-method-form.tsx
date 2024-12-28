"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

const paymentMethodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // Add other fields as needed
});

interface AddPaymentMethodFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onCancel: () => void;
}

export function AddPaymentMethodForm({ onSuccess, onCancel }: AddPaymentMethodFormProps) {
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: "",
    },
  });

  const createPaymentMethod = api.paymentMethod.create.useMutation({
    onSuccess: (data) => {
      onSuccess(data.id);
    },
  });

  const onSubmit = (values: z.infer<typeof paymentMethodSchema>) => {
    createPaymentMethod.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Add other payment method fields as needed */}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Payment Method</Button>
        </div>
      </form>
    </Form>
  );
} 