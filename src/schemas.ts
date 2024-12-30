import { BillingCycle } from "@prisma/client";

import { z } from "zod";

export const baseSubscriptionSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    price: z.number().positive({
      message: "Price must be a positive number.",
    }),
    billingCycle: z.nativeEnum(BillingCycle),
    autoRenew: z.boolean().default(true),
    startDate: z.date(),
    paymentMethodId: z.string().nullable(),
  });