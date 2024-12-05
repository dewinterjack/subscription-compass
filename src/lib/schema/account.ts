import { z } from "zod"

export const accountFormSchema = z.object({
  type: z.enum(["bank", "card"]),
  name: z.string().min(1, "Account name is required"),
  number: z.string()
    .min(4, "Account number must be at least 4 digits")
    .max(19, "Account number cannot exceed 19 digits")
    .refine(
      (val) => /^\d+$/.test(val),
      "Account number must contain only digits"
    ),
})

export type AccountFormValues = z.infer<typeof accountFormSchema> 