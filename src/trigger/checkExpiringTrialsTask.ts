import { logger, schedules } from "@trigger.dev/sdk/v3";
import { db } from "@/server/db";
import { addDays, startOfDay, endOfDay, format } from "date-fns";

// Define the scheduled task
export const checkExpiringTrialsTask = schedules.task({
  id: "check-expiring-trials",
  maxDuration: 300,
  cron: "0 0 * * *",
  run: async () => {

    const today = startOfDay(new Date());
    const sevenDaysFromNow = endOfDay(addDays(today, 7));

    const expiringTrials = await db.subscription.findMany({
      where: {
        endDate: {
          gte: today,
          lte: sevenDaysFromNow,
        },
        periods: {
          some: {
            isTrial: true,
          }
        },
      },
      include: {
        createdBy: true,
        periods: {
          where: {
            isTrial: true,
          },
          take: 1,
        },
      },
    });

    logger.log("Found expiring trials", { 
      count: expiringTrials.length,
      dateRange: `${format(today, "PP")} to ${format(sevenDaysFromNow, "PP")}`,
    });

    const notifications = await Promise.all(
      expiringTrials.map(async (trial) => {
        const daysUntilExpiry = Math.ceil(
          (trial.endDate!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        const expiryDate = format(trial.endDate!, "PP");
        
        return db.notification.create({
          data: {
            userId: trial.createdById,
            title: "Trial Subscription Ending Soon",
            description: `Your trial for ${trial.name} will expire ${daysUntilExpiry === 0 ? "today" : `in ${daysUntilExpiry} days`} on ${expiryDate}. Please update your subscription to continue using the service.`,
            expiresAt: trial.endDate!, // Notification will expire when the trial ends
          },
        });
      })
    );

    return {
      expiringTrials: expiringTrials.map(trial => ({
        id: trial.id,
        name: trial.name,
        endDate: trial.endDate,
        userEmail: trial.createdBy.email,
      })),
      totalCount: expiringTrials.length,
      notificationsCreated: notifications.length,
    };
  },
}); 