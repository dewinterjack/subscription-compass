import { db } from "@/server/db";

export async function createNotification({
  userId,
  title,
  description,
  expiresAt,
}: {
  userId: string;
  title: string;
  description: string;
  expiresAt?: Date;
}) {
  return db.notification.create({
    data: {
      userId,
      title,
      description,
      expiresAt,
    },
  });
} 