'use server'

import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export async function removeProvider(provider: string, userId: string) {
  try {
    await db.account.deleteMany({
      where: {
        provider: provider,
        userId: userId,
      },
    });
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { error: "Failed to delete account" };
  }
}