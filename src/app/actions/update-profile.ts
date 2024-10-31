'use server'

import { db } from "@/server/db";

export async function updateUserName(userId: string, name: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { firstName: name },
    });
  } catch (error) {
    console.error('Error updating user name:', error);
    throw new Error('Failed to update user name');
  }
}