import { z } from "zod"

export const paymentMethodFormSchema = z.object({
  type: z.enum(["bank", "card"]),
  name: z.string().min(1, "Payment method name is required"),
  number: z.string()
    .min(4, "Payment method number must be at least 4 digits")
    .max(19, "Payment method number cannot exceed 19 digits")
    .refine(
      (val) => /^\d+$/.test(val),
      "Payment method number must contain only digits"
    ),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
})
  .refine(
    (data) => {
      if (data.type === "card") {
        const isValidFormat = (
          data.expiryMonth &&
          data.expiryYear &&
          /^(0[1-9]|1[0-2])$/.test(data.expiryMonth) &&
          /^\d{4}$/.test(data.expiryYear)
        );

        if (!isValidFormat) return false;

        // Check if date is in the future
        const expiryDate = new Date(
          parseInt(data.expiryYear!),
          parseInt(data.expiryMonth!) - 1,
          1
        );
        return expiryDate > new Date();
      }
      return true;
    },
    {
      message: "Card expiration date must be valid and in the future",
      path: ["expiryMonth"],
    }
  )

export type PaymentMethodFormValues = z.infer<typeof paymentMethodFormSchema> 