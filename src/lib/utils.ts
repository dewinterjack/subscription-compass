import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Database } from "@/server/db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getPlaidAccessToken(userId: string, db: Database) {
  const plaidItem = await db.plaidItem.findFirst({
    where: {
      userId: userId,
    },
  });
  const accessToken = plaidItem?.accessToken;
  if (!accessToken) {
    throw new Error("No access token found");
  }
  return { accessToken, itemId: plaidItem?.id };
}